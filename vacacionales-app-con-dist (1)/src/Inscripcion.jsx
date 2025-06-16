
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const talleres = [...]; // truncado por brevedad

const initialState = {
  nombre: "",
  edad: "",
  representante: "",
  telefono: "",
  taller: "",
  horario: "",
};

export default function Inscripcion() {
  const [formData, setFormData] = useState(initialState);
  const [inscritos, setInscritos] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tallerData = talleres.find((t) => t.nombre === formData.taller);
    const edad = parseInt(formData.edad);
    const inscritosEnTaller = inscritos.filter((i) => i.taller === formData.taller).length;

    if (!tallerData) return;

    if (edad < tallerData.edades[0] || edad > tallerData.edades[1]) {
      setError("Edad no permitida para el taller seleccionado.");
      return;
    }

    if (inscritosEnTaller >= tallerData.cupo) {
      setError("Cupo lleno para este taller.");
      return;
    }

    setInscritos([...inscritos, formData]);
    setFormData(initialState);
    setError("");
  };

  const conteoPorTaller = talleres.map((t) => {
    const cantidad = inscritos.filter((i) => i.taller === t.nombre).length;
    return { taller: t.nombre, total: cantidad, cupo: t.cupo };
  });

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Inscripción – Jornadas Vacacionales</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required />
            <Input name="edad" placeholder="Edad" type="number" value={formData.edad} onChange={handleChange} required />
            <Input name="representante" placeholder="Representante" value={formData.representante} onChange={handleChange} required />
            <Input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
            <select name="taller" value={formData.taller} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecciona un taller</option>
              {talleres.map((t) => (
                <option key={t.nombre} value={t.nombre}>{t.nombre}</option>
              ))}
            </select>
            <select name="horario" value={formData.horario} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecciona un horario</option>
              {talleres.find((t) => t.nombre === formData.taller)?.horarios.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">Inscribir</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Inscritos por Taller</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Taller</th>
                <th className="py-2">Inscritos</th>
                <th className="py-2">Cupo</th>
              </tr>
            </thead>
            <tbody>
              {conteoPorTaller.map((t) => (
                <tr key={t.taller}>
                  <td className="py-1">{t.taller}</td>
                  <td className="py-1">{t.total}</td>
                  <td className="py-1">{t.cupo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
