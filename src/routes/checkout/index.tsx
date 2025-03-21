import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import { createOrder } from "@/services/order.service";

import styles from "./styles.module.css";

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

export default function Checkout() {
  const { cart, clearCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  });

  useEffect(() => {
    if (cartLoading) return;

    if ((!cart || !cart.items.length) && !isOrderCompleted) {
      navigate("/");
    }
  }, [cart, navigate, isOrderCompleted, cartLoading]);

  async function onSubmit(formData: CheckoutForm) {
    if (!cart) return;

    setLoading(true);
    try {
      const items = cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        title: item.product.title,
        price: item.product.price,
        imgSrc: item.product.imgSrc,
      }));

      const { orderId } = await createOrder(items, formData);
      setIsOrderCompleted(true);
      navigate(`/order-confirmation/${orderId}`);
      clearCart();
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!cart || !cart.items.length) {
    return <ContainerLoader />;
  }

  return (
    <Section className={styles.checkout}>
      <Container>
        <div className={styles.checkout__layout}>
          <div className={styles.checkout__summary}>
            <h2 className={styles.checkout__summary_title}>
              Resumen de la orden
            </h2>
            <div className={styles.checkout__summary_container}>
              {cart?.items?.map(({ product, quantity }) => (
                <div key={product.id} className={styles.checkout__item}>
                  <div className={styles["checkout__item-image"]}>
                    <img
                      src={product.imgSrc}
                      alt={product.title}
                      className={styles["checkout__item-image-content"]}
                    />
                  </div>
                  <div className={styles["checkout__item-details"]}>
                    <h3 className={styles["checkout__item-title"]}>
                      {product.title}
                    </h3>
                    <div className={styles["checkout__item-price"]}>
                      <p>{quantity}</p>
                      <X className={styles["checkout__item-price-icon"]} />
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.checkout__total}>
                <p>Total</p>
                <p>${(cart?.total || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <form
            className={styles.checkout__form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset>
              <legend className={styles.checkout__legend}>
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
            <Separator className={styles.checkout__separator} />
            <fieldset>
              <legend className={styles.checkout__legend}>
                Información de envío
              </legend>
              <div className={styles["checkout__form-fields"]}>
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
              className={styles.checkout__submit}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar Orden"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
