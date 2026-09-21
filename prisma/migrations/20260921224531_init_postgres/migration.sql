-- CreateTable
CREATE TABLE "Evaluador" (
    "id" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "matriculaNacional" TEXT,
    "matriculaProvincial" TEXT,
    "cuitProfesional" TEXT,
    "centroMedico" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "rubro" TEXT,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "campaniaNombre" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoExamen" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajador" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "puesto" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "antiguedadAnios" INTEGER NOT NULL,
    "factoresRiesgo" TEXT NOT NULL,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionExamen" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "trabajadorId" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "dictamen" TEXT,
    "observacionesMedicas" TEXT,
    "evaluadorId" TEXT,
    "turnoEtiqueta" TEXT,
    "completadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionExamen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstudioRequerido" (
    "id" TEXT NOT NULL,
    "asignacionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EstudioRequerido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstudioResultado" (
    "id" TEXT NOT NULL,
    "estudioRequeridoId" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "datos" TEXT,
    "archivoNombre" TEXT,
    "archivoTamanioKb" INTEGER,
    "completadoEn" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstudioResultado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Evaluador_cuit_key" ON "Evaluador"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cuit_key" ON "Empresa"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_codigo_key" ON "Lote"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajador_empresaId_dni_key" ON "Trabajador"("empresaId", "dni");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionExamen_loteId_trabajadorId_key" ON "AsignacionExamen"("loteId", "trabajadorId");

-- CreateIndex
CREATE UNIQUE INDEX "EstudioRequerido_asignacionId_tipo_key" ON "EstudioRequerido"("asignacionId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "EstudioResultado_estudioRequeridoId_key" ON "EstudioResultado"("estudioRequeridoId");

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajador" ADD CONSTRAINT "Trabajador_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionExamen" ADD CONSTRAINT "AsignacionExamen_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionExamen" ADD CONSTRAINT "AsignacionExamen_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionExamen" ADD CONSTRAINT "AsignacionExamen_evaluadorId_fkey" FOREIGN KEY ("evaluadorId") REFERENCES "Evaluador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudioRequerido" ADD CONSTRAINT "EstudioRequerido_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES "AsignacionExamen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudioResultado" ADD CONSTRAINT "EstudioResultado_estudioRequeridoId_fkey" FOREIGN KEY ("estudioRequeridoId") REFERENCES "EstudioRequerido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
