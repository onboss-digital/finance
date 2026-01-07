"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"

interface ExportadorProps {
  dados: any[]
  nomeArquivo?: string
}

export default function ExportadorCSV({ dados, nomeArquivo = "relatorio" }: ExportadorProps) {
  const handleExportCSV = () => {
    exportToCSV(dados, `${nomeArquivo}.csv`)
  }

  const handleExportJSON = () => {
    exportToJSON(dados, `${nomeArquivo}.json`)
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportCSV}
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
      >
        <Download className="w-4 h-4 mr-2" />
        CSV
      </Button>
      <Button
        onClick={handleExportJSON}
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
      >
        <Download className="w-4 h-4 mr-2" />
        JSON
      </Button>
    </div>
  )
}
