export function mergeApplications(applications, localApplications) {
  return applications.map((application) => {
    const local = localApplications[application.id]

    return {
      id: application.id,
      name: application.name,
      executablePath: local?.executablePath ?? null,
      args: [...application.args, ...(local?.args ?? [])]
    }
  })
}
