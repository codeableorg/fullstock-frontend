import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  Button,
  Container,
  InputField,
  Section,
  Separator,
  SelectField,
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

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  useEffect(() => {
    if ((!cart || !cart.items.length) && !isOrderCompleted) {
      navigate("/");
    }
  }, [cart, navigate, isOrderCompleted]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

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
    return null;
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
          <form className={styles.checkout__form} onSubmit={handleSubmit}>
            <fieldset>
              <legend className={styles.checkout__legend}>
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
            <Separator className={styles.checkout__separator} />
            <fieldset>
              <legend className={styles.checkout__legend}>
                Información de envío
              </legend>
              <div className={styles["checkout__form-fields"]}>
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
                  placeholder="Seleccionar país"
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
