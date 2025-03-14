import { X } from "lucide-react";
import { useEffect, useState } from "react";
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

import { useForm, SubmitHandler } from "react-hook-form";

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
  country: z.string().min(2, "El país es requerido"),
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
    setError,
    formState: { errors },
  } = useForm<CheckoutForm>();

  useEffect(() => {
    if (cartLoading) return;

    if ((!cart || !cart.items.length) && !isOrderCompleted) {
      navigate("/");
    }
  }, [cart, navigate, isOrderCompleted, cartLoading]);

  const onSubmit: SubmitHandler<CheckoutForm> = async (data) => {
    if (!cart) return;

    setLoading(true);
    try {
      const parsedData = CheckoutFormSchema.safeParse(data);

      if (!parsedData.success) {
        Object.entries(parsedData.error.flatten().fieldErrors).forEach(
          ([field, error]) => {
            setError(field as keyof CheckoutForm, {
              message: error.join(", "),
            });
          }
        );
        return;
      }

      const items = cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        title: item.product.title,
        price: item.product.price,
        imgSrc: item.product.imgSrc,
      }));

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const { orderId } = await createOrder(items, formData);
      setIsOrderCompleted(true);
      navigate(`/order-confirmation/${orderId}`);
      clearCart();
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setLoading(false);
    }
  };

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
                {...register("email")}
                type="email"
                autoComplete="email"
                value={user?.email}
                readOnly={Boolean(user)}
                errors={errors.email?.message}
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
                  {...register("firstName")}
                  autoComplete="given-name"
                  errors={errors.firstName?.message}
                />
                <InputField
                  label="Apellido"
                  {...register("lastName")}
                  autoComplete="family-name"
                  errors={errors.lastName?.message}
                />
                <InputField
                  label="Compañia"
                  {...register("company")}
                  autoComplete="organization"
                  errors={errors.company?.message}
                />
                <InputField
                  label="Dirección"
                  {...register("address")}
                  autoComplete="street-address"
                  errors={errors.address?.message}
                />
                <InputField
                  label="Ciudad"
                  {...register("city")}
                  autoComplete="address-level2"
                  errors={errors.city?.message}
                />
                <SelectField
                  label="País"
                  {...register("country")}
                  options={countryOptions}
                  placeholder="Seleccionar país"
                />
                <InputField
                  label="Provincia/Estado"
                  {...register("region")}
                  autoComplete="address-level1"
                  errors={errors.region?.message}
                />
                <InputField
                  label="Código Postal"
                  {...register("zip")}
                  autoComplete="postal-code"
                  errors={errors.zip?.message}
                />
                <InputField
                  label="Teléfono"
                  {...register("phone")}
                  autoComplete="tel"
                  errors={errors.phone?.message}
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
