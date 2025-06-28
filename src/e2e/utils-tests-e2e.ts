/* Helper functions → Playwright */

export type OrderFormData = Record<string, string>;

export const createOrderFormData = (
  overrides?: Partial<OrderFormData>
): OrderFormData => ({
  "Correo electrónico": "testinodp@codeable.com",
  Nombre: "Testino",
  Apellido: "Diprueba",
  Compañia: "",
  Dirección: "Calle Di Prueba 123",
  Ciudad: "Lima",
  "Provincia/Estado": "Lima",
  "Código Postal": "51111",
  Teléfono: "987456321",
  ...overrides,
});
