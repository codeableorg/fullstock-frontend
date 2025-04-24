import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type ActionFunctionArgs,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router";
import { z } from "zod";

import { Button, Container, InputField, Section } from "@/components/ui";
import { getCurrentUser, login } from "@/services/auth.service";

const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type ActionData = { error: string } | undefined;

export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await login(email, password);
    return redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido" };
  }
}

export async function clientLoader() {
  const user = await getCurrentUser();
  if (user) return redirect("/");
}

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const data = useActionData() as ActionData;

  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: LoginForm) {
    submit(data, { method: "post" });
  }

  return (
    <Section>
      <Container className="max-w-sm">
        <h1 className="text-2xl leading-7 font-bold text-center mb-10">
          Inicia sesión en tu cuenta
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <InputField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <InputField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            size="lg"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
          </Button>
          {data?.error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {data.error}
            </p>
          )}
        </form>
        <div className="flex justify-center gap-2 mt-10 text-sm leading-6">
          <span className="text-muted-foreground">¿Aún no tienes cuenta?</span>
          <Link to="/signup" className="text-accent-foreground hover:underline">
            Crea una cuenta
          </Link>
        </div>
      </Container>
    </Section>
  );
}
