import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router";
import { z } from "zod";

import {
  Button,
  Container,
  InputField,
  Section,
  Separator,
  SelectField,
  ContainerLoader,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { useCart } from "@/contexts/cart.context";
import { CartItem } from "@/models/cart.model";
import { User } from "@/models/user.model";
import { getCurrentUser } from "@/services/auth.service";
import { deleteLocalCart, deleteRemoteCart } from "@/services/cart.service";
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

export const CheckoutFormSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  company: z.string().optional(),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  country: z.string().min(1, "El país es requerido"),
  region: z.string().min(1, "La provincia/estado es requerido"),
  zip: z.string().min(1, "El código postal es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
});

type CheckoutForm = z.infer<typeof CheckoutFormSchema>;

type LoaderData = {
  user?: Omit<User, "password">;
};

export async function action({ request }: ActionFunctionArgs) {
  let user;

  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }

  const formData = await request.formData();
  const shippingDetails = JSON.parse(
    formData.get("shippingDetailsJson") as string
  ) as CheckoutForm;
  const cartItems = JSON.parse(
    formData.get("cartItemsJson") as string
  ) as CartItem[];

  const items = cartItems.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    title: item.product.title,
    price: item.product.price,
    imgSrc: item.product.imgSrc,
  }));

  const { orderId } = await createOrder(items, shippingDetails);

  if (user) deleteRemoteCart();
  else deleteLocalCart();

  return redirect(`/order-confirmation/${orderId}`);
}

export async function loader() {
  try {
    const user = await getCurrentUser();
    return { user };
  } catch {
    return {};
  }
}

export default function Checkout() {
  const { cart, loading: cartLoading } = useCart(); // pendiente de mover

  const { user } = useLoaderData() as LoaderData;
  const submit = useSubmit();
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [isOrderCompleted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      email: user?.email,
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      country: "",
      region: "",
      zip: "",
      phone: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (cartLoading) return;

    if ((!cart || !cart.items.length) && !isOrderCompleted) {
      navigate("/");
    }
  }, [cart, navigate, isOrderCompleted, cartLoading]);

  async function onSubmit(formData: CheckoutForm) {
    if (!cart) return;

    submit(
      {
        shippingDetailsJson: JSON.stringify(formData),
        cartItemsJson: JSON.stringify(cart.items),
      },
      { method: "POST" }
    );
  }

  if (!cart || !cart.items.length) {
    return <ContainerLoader />;
  }

  return (
    <Section className="bg-muted">
      <Container>
        <div className="flex flex-col gap-12 max-w-2xl mx-auto lg:flex-row lg:max-w-none">
          <div className="flex-grow">
            <h2 className="text-lg font-medium mb-4">Resumen de la orden</h2>
            <div className="border border-border rounded-xl bg-background flex flex-col">
              {cart?.items?.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-6 p-6 border-b border-border"
                >
                  <div className="w-20 rounded-xl bg-muted">
                    <img
                      src={product.imgSrc}
                      alt={product.title}
                      className="w-full aspect-square object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <h3 className="text-sm leading-5">{product.title}</h3>
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
                <p>${(cart?.total || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <form
            className="flex-grow lg:max-w-4xl lg:order-first"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset>
              <legend className="text-xl font-medium mb-6">
                Información de contacto
              </legend>
              <InputField
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                defaultValue={user?.email}
                readOnly={Boolean(user)}
                error={errors.email?.message}
                {...register("email")}
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
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <InputField
                  label="Apellido"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
                <InputField
                  label="Compañia"
                  autoComplete="organization"
                  error={errors.company?.message}
                  {...register("company")}
                />
                {errors.company?.message && <p>{errors.company?.message}</p>}
                <InputField
                  label="Dirección"
                  autoComplete="street-address"
                  error={errors.address?.message}
                  {...register("address")}
                />
                <InputField
                  label="Ciudad"
                  autoComplete="address-level2"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <SelectField
                  label="País"
                  options={countryOptions}
                  placeholder="Seleccionar país"
                  error={errors.country?.message}
                  {...register("country")}
                />
                <InputField
                  label="Provincia/Estado"
                  autoComplete="address-level1"
                  error={errors.region?.message}
                  {...register("region")}
                />
                <InputField
                  label="Código Postal"
                  autoComplete="postal-code"
                  error={errors.zip?.message}
                  {...register("zip")}
                />
                <InputField
                  label="Teléfono"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </fieldset>
            <Button
              size="xl"
              className="w-full mt-6"
              disabled={!isValid || loading}
            >
              {loading ? "Procesando..." : "Confirmar Orden"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
