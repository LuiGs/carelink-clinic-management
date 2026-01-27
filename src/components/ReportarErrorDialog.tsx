"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const TO = "lslc.soporte@gmail.com";

function buildMailto() {
  const subject = "Reporte de error - DermaCore";
  const body = [
    "Describa el problema:",
    "",
    "Pantalla donde ocurrió:",
    "Pasos para reproducir:",
    "Fecha y hora:",
  ].join("\n");

  return `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const PHONES = [
  { label: "+54 9 387 504-3021", href: "tel:+5493875043021" },
  { label: "+54 9 387 562-3562", href: "tel:+5493875623562" },
  { label: "+54 9 387 301-6062", href: "tel:+5493873016062" },
  { label: "+54 9 387 311-1983", href: "tel:+5493873111983" },
];

export default function ReportarErrorDialog() {
  const mailto = React.useMemo(() => buildMailto(), []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground">
          Reportar un error
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contactos de Soporte</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mail */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Email
            </div>

            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <p className="font-medium">{TO}</p>
              <p className="text-muted-foreground">
                Se abrirá tu app de correo (ideal en mobile: Gmail).
              </p>
            </div>

            <div className="flex gap-2">
              <a href={mailto} className="flex-1">
                <Button className="w-full">Enviar mail</Button>
              </a>

              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(TO)}
              >
                Copiar
              </Button>
            </div>
          </div>

          {/* Teléfonos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Teléfonos
            </div>

            <div className="space-y-1">
              {PHONES.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="block rounded-md border bg-white px-3 py-2 text-sm hover:bg-muted/30"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
