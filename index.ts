import GetPrList from "./core/GetPrList";
import GetPrBranchInfo from "./core/GetPrBranchInfo";
import RebasePrBranch from "./core/RebasePrBranch";
import wx from "./notify/wx";

const prBranchInfoList = GetPrList(process.argv[2])
  .map(GetPrBranchInfo)
prBranchInfoList.forEach(v => RebasePrBranch(v))

wx(JSON.stringify(prBranchInfoList), process.argv[3])
