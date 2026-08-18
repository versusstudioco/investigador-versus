/* Base de referencia de DEMOSTRACIÓN.
   ⚠ Son ejemplos. La verificación con validez legal se hace en SIPI (SIC). */

export type RegistroMarca = {
  marca: string;
  clase: number;
  titular: string;
  estado: "Registrada" | "En trámite" | "Negada";
  expediente: string;
  tipo: string;
};

export const EXAMPLE_REGISTRY: RegistroMarca[] = [
  { marca: "LAS MANOS", clase: 25, titular: "Confecciones Andinas S.A.S.", estado: "Registrada", expediente: "SD2018/0099888", tipo: "Nominativa" },
  { marca: "LAS MANOS", clase: 35, titular: "Comercializadora El Tejido Ltda.", estado: "Registrada", expediente: "SD2020/0044120", tipo: "Mixta" },
  { marca: "MANOS", clase: 3, titular: "Cosmética Natural Colombia", estado: "Registrada", expediente: "SD2016/0011002", tipo: "Nominativa" },
  { marca: "MANOS DE ORO", clase: 43, titular: "Restaurantes Típicos S.A.S.", estado: "Registrada", expediente: "SD2019/0033551", tipo: "Mixta" },
  { marca: "LAS MANITOS", clase: 25, titular: "Textiles Infantiles S.A.", estado: "En trámite", expediente: "SD2023/0090011", tipo: "Nominativa" },
  { marca: "CAFÉ VERSUS", clase: 30, titular: "Trilladora del Valle", estado: "Registrada", expediente: "SD2017/0022119", tipo: "Mixta" },
  { marca: "VERSUS", clase: 41, titular: "Academia Deportiva Versus", estado: "Registrada", expediente: "SD2021/0055201", tipo: "Nominativa" },
];
