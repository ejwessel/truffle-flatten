const fs = require('fs-extra')

async function flatten() {
  const flattener = await require('truffle-flattener');
  artifact = process.argv[2]
  artifactSource = process.argv[3]

  console.log("artifact: " + artifact)
  console.log("artifactSource: " + artifactSource)

  const versionReg = /pragma solidity \^?([0-9]+.[0-9]+.[0-9]+;)/g
  const experimentalReg = /pragma experimental ABIEncoderV2;/g
  const emptyReg = /^\s*[\r\n]/gm
  //const sourceCode = fs.readFileSync(artifactSource, 'utf8')
  let flatSourceCode = await flattener([ artifactSource ], '.');
  let versions = flatSourceCode.match(versionReg);
  let experimentals = flatSourceCode.match(experimentalReg);
  let pragmaVersion = versions[0] ? versions[0] : "";
  let pragmaExperimental = experimentals[0] ? experimentals[0] : "";
  flatSourceCode = flatSourceCode.replace(versionReg, "")
  flatSourceCode = flatSourceCode.replace(experimentalReg, "")
  flatSourceCode = flatSourceCode.replace(emptyReg,"")
  flatSourceCode = pragmaExperimental + "\n" + flatSourceCode
  flatSourceCode = pragmaVersion + "\n" + flatSourceCode
  let fileName = "flat/" + artifact + "_Flattened.sol";
  console.log(fileName)
  fs.outputFile(fileName, flatSourceCode, function (err) {
    if (err) throw err;
  })
}

flatten().then(result => {
  console.log('Generated Flattened File')
}).catch(error => {
  console.log(error)
});
