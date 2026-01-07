export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {})
  const csv = [headers.join(","), ...data.map((row) => headers.map((h) => JSON.stringify(row[h])).join(","))].join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
