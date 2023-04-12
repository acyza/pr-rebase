import FetchBranch, { defaultDistDir, initDistDir } from "./FetchBranch"
import { spawnSync,SpawnSyncOptions } from 'child_process'
import type { PrBranchInfo } from './GetPrBranchInfo'

const spanOption: SpawnSyncOptions = {
  shell: true,
  stdio: [null, process.stdout, process.stderr]
}
let preRepository: string | null = null
export default (branchInfo: PrBranchInfo,distDir: string = defaultDistDir) => {
  if (branchInfo.to.repository !== preRepository) {
    preRepository = branchInfo.to.repository
    initDistDir()
  }
  FetchBranch(branchInfo.from, 'from', distDir);
  FetchBranch(branchInfo.to, 'to', distDir);
  spawnSync('git checkout from', {
    ...spanOption,
    cwd: distDir
  })
  spawnSync('git rebase to', {
    ...spanOption,
    cwd: distDir
  })
  spawnSync('git remote remove origin', {
    ...spanOption,
    cwd: distDir
  })
  spawnSync(`git remote add origin https://github.com/${branchInfo.from.repository}.git`, {
    ...spanOption,
    cwd: distDir
  })
  spawnSync(`git push origin HEAD:${branchInfo.from.branch} --force`, {
    ...spanOption,
    cwd: distDir
  })
}
