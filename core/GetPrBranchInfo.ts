import { spawnSync } from 'child_process'
import type { PrInfo } from './GetPrList'
import type { BranchInfo } from './FetchBranch'

export interface PrBranchInfo {
  from: BranchInfo,
  to: BranchInfo
}
export default (prinfo: PrInfo) => {
  const result = spawnSync(
    `gh pr view ${prinfo.number} --repo ${prinfo.repository} --json baseRefName,headRefName,headRepository,headRepositoryOwner`,
    {
      shell: true
    }
  )
  if(result.error) {
    throw result
  }
  const data = JSON.parse(result.output.map(v => v?.toString()).join('')) as any
  return {
    from: {
      repository: `${data.headRepositoryOwner.name}/${data.headRepository.name}`,
      branch: data.headRefName
    },
    to: {
      repository: prinfo.repository,
      branch: data.baseRefName
    }
  } as PrBranchInfo
}
