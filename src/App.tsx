import { useState } from 'react';
import { FileDown, Stethoscope } from 'lucide-react';
import { generarCertificadoPDF } from './lib/pdf';
import type { DatosCertificado } from './lib/pdf';

const INITIAL_FORM: DatosCertificado = {
  nombre: '',
  apellido: '',
  rut: '',
  razon: '',
  fechaAtencion: new Date().toISOString().split('T')[0],
};

function App() {
  const [form, setForm] = useState<DatosCertificado>(INITIAL_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generarCertificadoPDF(form);
  };

  const camposCompletos =
    form.nombre && form.apellido && form.rut && form.razon && form.fechaAtencion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CEL Ñuble</h1>
          <p className="text-gray-500 mt-1">Generador de Certificados Médicos</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Datos del paciente */}
            <div>
              <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">Datos del Paciente</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Juan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                  <input
                    type="text"
                    name="rut"
                    value={form.rut}
                    onChange={handleChange}
                    required
                    placeholder="12.345.678-9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Atención</label>
                  <input
                    type="date"
                    name="fechaAtencion"
                    value={form.fechaAtencion}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Certificado</label>
                <textarea
                  name="razon"
                  value={form.razon}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Ej: Paciente acude a evaluación pre-ocupacional, se realizan exámenes de laboratorio y evaluación médica, resultando apto para desempeñar funciones..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Info médico fija */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Médico Firmante</h2>
              <p className="text-sm text-gray-700 font-medium">Dra. Isidora Lobos Canahuate</p>
              <p className="text-xs text-gray-500">RUT: 19.416.800-4 · N° Registro SIS: 910210</p>
            </div>
          </div>

          {/* Botón generar */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="submit"
              disabled={!camposCompletos}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileDown className="w-5 h-5" /> Generar Certificado PDF
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          CEL Ñuble — Centro de Evaluación Laboral
        </p>
      </div>
    </div>
  );
}

export default App;
