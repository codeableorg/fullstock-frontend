import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/cart";
import { X } from "lucide-react";

export default function Checkout() {
  const { state } = useCart();
  return (
    <section className="py-12 md:py-16 bg-muted">
      <Container className="flex flex-col gap-12 max-w-2xl mx-auto lg:flex-row lg:max-w-full">
        <div className="grow lg:order-1">
          <h2 className="text-lg font-medium mb-4">Resumen de la orden</h2>
          <div className="divide-y divide-border border border-border rounded-xl">
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
        <form className="lg:max-w-[600px] grow">
          <fieldset>
            <legend className="text-xl font-medium mb-6">
              Información de contacto
            </legend>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <Input id="email" type="email" name="email" />
            </div>
          </fieldset>
          <Separator className="my-6" />
          <fieldset>
            <legend className="text-xl font-medium mb-6">
              Información de envío
            </legend>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <Input id="name" name="firstName" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="lastname"
                >
                  Apellido
                </label>
                <Input id="lastname" name="lastName" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="company"
                >
                  Compañia
                </label>
                <Input id="company" name="company" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="address"
                >
                  Dirección
                </label>
                <Input id="address" name="address" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="city"
                >
                  Ciudad
                </label>
                <Input id="city" name="city" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="country"
                >
                  País
                </label>
                <Select name="country">
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="BO">Bolivia</SelectItem>
                    <SelectItem value="BR">Brasil</SelectItem>
                    <SelectItem value="CL">Chile</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                    <SelectItem value="CR">Costa Rica</SelectItem>
                    <SelectItem value="CU">Cuba</SelectItem>
                    <SelectItem value="DO">República Dominicana</SelectItem>
                    <SelectItem value="EC">Ecuador</SelectItem>
                    <SelectItem value="SV">El Salvador</SelectItem>
                    <SelectItem value="GT">Guatemala</SelectItem>
                    <SelectItem value="HT">Haití</SelectItem>
                    <SelectItem value="HN">Honduras</SelectItem>
                    <SelectItem value="MX">México</SelectItem>
                    <SelectItem value="NI">Nicaragua</SelectItem>
                    <SelectItem value="PA">Panamá</SelectItem>
                    <SelectItem value="PY">Paraguay</SelectItem>
                    <SelectItem value="PE">Perú</SelectItem>
                    <SelectItem value="PR">Puerto Rico</SelectItem>
                    <SelectItem value="UY">Uruguay</SelectItem>
                    <SelectItem value="VE">Venezuela</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="region"
                >
                  Provincia/Estado
                </label>
                <Input id="region" name="region" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="zip"
                >
                  Código Postal
                </label>
                <Input id="zip" name="zip" />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="phone"
                >
                  Teléfono
                </label>
                <Input id="phone" name="phone" />
              </div>
              <Button size="xl" className="w-full">
                Confirmar Orden
              </Button>
            </div>
          </fieldset>
        </form>
      </Container>
    </section>
  );
}
