import fs from 'node:fs'

const TEST_CASE_COUNT = 1_000
const TEST_DIR = new URL('./tests/', import.meta.url)

function generateTest() {
  const test = `\
test('creates a paragraph dynamically', () => {
	const button = document.createElement('button')
	button.innerText = 'Create paragraph'
	document.body.appendChild(button)

	button.addEventListener('click', () => {
		const text = document.createElement('p')
		text.innerText = 'Hello world'
		document.body.appendChild(text)
	})

	button.click()
	expect(document.querySelector('p').innerText).toBe('Hello world')
})`

  return test
}

async function generate() {
  const allTests = new Array(TEST_CASE_COUNT).fill(generateTest())

  // Distribute test cases across test suites.
  const testSuites = []
  while (allTests.length > 0) {
    const testClusterSize = Math.random() * (10 - 1) + 1
    const testCluster = allTests.splice(0, testClusterSize)
    testSuites.push(testCluster)
  }

  // Write test suites to disk.
  const pendingFiles = []
  testSuites.forEach((testSuite, index) => {
    const testPath = new URL(`./test-${index}.test.js`, TEST_DIR)
    pendingFiles.push(fs.promises.writeFile(testPath, testSuite.join('\n\n')))
  })

  await Promise.all(pendingFiles)

  console.log(
    'Generated %s test suites with %s tests!',
    testSuites.length,
    TEST_CASE_COUNT,
  )
}

generate()
