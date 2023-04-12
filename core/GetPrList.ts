import { spawnSync } from 'child_process'

export interface PrInfo {
  number: number,
  repository: string,
}

type prState = 'open' | 'close' | 'all' | 'draft'

export default (username: string, state: prState = 'open') => {
  const result = spawnSync(`gh search prs --author ${username} --state ${state} --json repository,number`,{
    shell: true
  })

  if (result.error) {
    throw result.error
  }

  const data = JSON.parse(result.output.map(value => value?.toString()).join('')) as any[]
  return data.map(v => {
    v.repository = v.repository.nameWithOwner
    return v
  }) as PrInfo[]
}
