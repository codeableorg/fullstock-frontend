import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { Separator } from "@/components/ui/separator";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/contexts/auth.context";
import { useCart } from "@/contexts/cart.context";
import { createOrder } from "@/services/order.service";

const countryOptions = [
  { value: "AR", label: "Argentina" },
  { value: "BO", label: "Bolivia" },
  { value: "BR", label: "Brasil" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "CR", label: "Costa Rica" },
  { value: "CU", label: "Cuba" },
  { value: "DO", label: "República Dominicana" },
  { value: "EC", label: "Ecuador" },
  { value: "SV", label: "El Salvador" },
  { value: "GT", label: "Guatemala" },
  { value: "HT", label: "Haití" },
  { value: "HN", label: "Honduras" },
  { value: "MX", label: "México" },
  { value: "NI", label: "Nicaragua" },
  { value: "PA", label: "Panamá" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Perú" },
  { value: "PR", label: "Puerto Rico" },
  { value: "UY", label: "Uruguay" },
  { value: "VE", label: "Venezuela" },
];

export default function Checkout() {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!state.items) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      const { orderId } = await createOrder(state.items, formData);
      await clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section className="bg-muted">
      <Container>
        <div className="flex flex-col gap-12 max-w-2xl mx-auto lg:flex-row lg:max-w-full">
          <div className="grow lg:order-1">
            <h2 className="text-lg font-medium mb-4">Resumen de la orden</h2>
            <div className="divide-y divide-border border border-border rounded-xl bg-background">
              {state.items?.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-6 p-6">
                  <div className="w-20 rounded-xl bg-muted">
                    <img
                      src={product.imgSrc}
                      alt={product.title}
                      className="w-full aspect-square object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between grow">
                    <h3 className="text-sm">{product.title}</h3>
                    <div className="flex text-sm font-medium gap-4 items-center self-end">
                      <p>{quantity}</p>
                      <X className="w-4 h-4" />
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between p-6 text-base font-medium">
                <p>Total</p>
                <p>${state.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <form
            className="lg:max-w-[600px] grow [&_:invalid]:scroll-mt-[200px] md:[&_:invalid]:scroll-mt-[160px]"
            onSubmit={handleSubmit}
          >
            <fieldset>
              <legend className="text-xl font-medium mb-6">
                Información de contacto
              </legend>
              <InputField
                label="Correo electrónico"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={user?.email}
                readOnly={Boolean(user)}
              />
            </fieldset>
            <Separator className="my-6" />
            <fieldset>
              <legend className="text-xl font-medium mb-6">
                Información de envío
              </legend>
              <div className="flex flex-col gap-6">
                <InputField
                  label="Nombre"
                  name="firstName"
                  required
                  autoComplete="given-name"
                />
                <InputField
                  label="Apellido"
                  name="lastName"
                  required
                  autoComplete="family-name"
                />
                <InputField
                  label="Compañia"
                  name="company"
                  autoComplete="organization"
                />
                <InputField
                  label="Dirección"
                  name="address"
                  required
                  autoComplete="street-address"
                />
                <InputField
                  label="Ciudad"
                  name="city"
                  required
                  autoComplete="address-level2"
                />
                <SelectField
                  label="País"
                  name="country"
                  options={countryOptions}
                  required
                />
                <InputField
                  label="Provincia/Estado"
                  name="region"
                  required
                  autoComplete="address-level1"
                />
                <InputField
                  label="Código Postal"
                  name="zip"
                  required
                  autoComplete="postal-code"
                />
                <InputField
                  label="Teléfono"
                  name="phone"
                  required
                  autoComplete="tel"
                />
              </div>
            </fieldset>
            <Button size="xl" className="w-full mt-6" disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Orden"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
