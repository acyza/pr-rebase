import { spawnSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'

export interface BranchInfo {
  repository: string,
  branch: string
}

export const defaultDistDir = './temp'
let defaultDistDirInit = false

export const initDistDir = (distDir: string = defaultDistDir) => {
  if (distDir === defaultDistDir) defaultDistDirInit = true
  if(existsSync(distDir)) {
    throw new Error('目标文件夹已存在')
  }
  mkdirSync(distDir)
  spawnSync('git init', {
    cwd: distDir,
    shell: true,
    stdio: [null, process.stdout, process.stderr]
  })
}

export default (info: BranchInfo,toBranch: string, distDir: string = defaultDistDir) => {
  //if (distDir === defaultDistDir && !defaultDistDirInit) initDistDir()
  const result = spawnSync(
    `git fetch https://github.com/${info.repository}.git ${info.branch}:${toBranch}`,
    {
      cwd: distDir,
      shell: true,
      stdio: [null, process.stdout, process.stderr]
    }
  )
  if (result.error) {
    throw result.error
  }
}
