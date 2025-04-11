import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ActionFunctionArgs,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router";
import { z } from "zod";

import { Button, Container, InputField, Section } from "@/components/ui";
import { debounceAsync} from "@/lib/utils";
import { findEmail } from "@/services/user.service";
import { signup } from "@/services/auth.service";

const debouncedFindEmail = debounceAsync(findEmail, 300);

const SignupSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
    .refine(async (email) => {
      if (email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return await debouncedFindEmail(email);
      } else {
        return false;
      }
    }, "El correo no esta disponible"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignupForm = z.infer<typeof SignupSchema>;

type ActionData = { error: string } | undefined;

export async function action ({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signup(email, password);
    return redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido" };
  }
}

export default function Signup() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const data = useActionData() as ActionData;

  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: SignupForm) {
    submit(data, { method: "post" });
  }

  return (
    <Section>
      <Container className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-center mb-10">Crea una cuenta</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <InputField
            label="Correo electrónico"
            type="email"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <InputField
            label="Contraseña"
            type="password"
            required
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            size="lg"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear cuenta"}
          </Button>
          {data?.error && (
            <p className="text-red-500 text-sm text-center mt-2">{data.error}</p>
          )}
        </form>
        <div className="flex justify-center gap-2 mt-10 text-sm">
          <span className="text-muted-foreground">¿Ya tienes una cuenta?</span>
          <Link to="/login" className="text-accent-foreground hover:underline">
            Inicia sesión
          </Link>
        </div>
      </Container>
    </Section>
  );
}
