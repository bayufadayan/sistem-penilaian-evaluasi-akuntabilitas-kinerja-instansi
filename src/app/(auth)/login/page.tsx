"use client";
import NavbarLite from "@/components/navbarLite";
import Footer from "@/components/footer";
import Image from "next/image";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema } from "@/lib/form-schema";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "@/styles/login.module.css";

const LoginPage: FC = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.back();
    }
  }, [router, status]);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });

  const handleLogin = async (values: z.infer<typeof signInFormSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });

      if (!res?.error) {
        setIsError(false);
        router.push("/");
      } else {
        setErrorMessage("Email atau password salah");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan, silakan coba lagi");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    console.log(values);
    handleLogin(values);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.allGeneral}>
      <NavbarLite />

      <main className={`${styles.loginMain}`}>
        <div className={styles.container}>
          <div className={styles.loginContainer}>
            <div className={styles.loginTitle}>
              <h2>Selamat Datang di EkaPrime</h2>
              <h5>
                Sistem Evaluasi Akuntabilitas Kinerja untuk <span>BPMSPH</span>
              </h5>
            </div>

            <div className={styles.loginForm}>
              <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                <div className={styles.inputContainer}>
                  <div className={styles.emailContainer}>
                    <label htmlFor="email">Email</label>
                    <input
                      {...form.register("email")}
                      type="email"
                      name="email"
                      id="email"
                      className="input-bordered input tracking-widest"
                      required
                    />
                    {isError && <p className="text-red-700">{errorMessage}</p>}
                    {form.formState.errors.email && (
                      <p className="text-red-700">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className={`${styles.passwordContainer} relative`}>
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        {...form.register("password")}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className="w-full pr-10"
                        required
                      />
                      <div
                        className="absolute right-4 top-6 transform -translate-y-1/2 opacity-70 cursor-pointer"
                        onClick={togglePasswordVisibility}
                        onKeyDown={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <title>true</title>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M6 2C4.6065 2 3.3685 2.6285 2.487 3.4065C2.045 3.797 1.68 4.235 1.423 4.672C1.17 5.1005 1 5.565 1 6C1 6.435 1.17 6.8995 1.423 7.328C1.68 7.7645 2.0445 8.203 2.487 8.5935C3.3685 9.3715 4.607 10 6 10C7.3935 10 8.6315 9.3715 9.513 8.5935C9.9555 8.203 10.32 7.7645 10.577 7.328C10.83 6.8995 11 6.435 11 6C11 5.565 10.83 5.1005 10.577 4.672C10.32 4.2355 9.9555 3.797 9.513 3.4065C8.6315 2.6285 7.393 2 6 2ZM7 6C7.18 6 7.3485 5.9525 7.4945 5.8695C7.52115 6.1761 7.45284 6.48348 7.29884 6.74993C7.14485 7.01639 6.91262 7.22903 6.63367 7.35901C6.35471 7.489 6.04252 7.53003 5.73945 7.47654C5.43637 7.42306 5.15709 7.27764 4.93947 7.06003C4.72186 6.84241 4.57644 6.56313 4.52296 6.26005C4.46947 5.95698 4.51051 5.64479 4.64049 5.36583C4.77047 5.08688 4.98311 4.85465 5.24957 4.70066C5.51602 4.54666 5.8234 4.47836 6.13 4.505C6.0433 4.65718 5.9981 4.82946 5.9989 5.0046C5.99971 5.17974 6.0465 5.3516 6.13459 5.50297C6.22268 5.65435 6.34899 5.77993 6.50086 5.86716C6.65274 5.95439 6.82486 6.00019 7 6Z"
                              fill="black"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <title>test</title>
                            <path
                              d="M1.5249 4.65501C1.50364 4.59153 1.49535 4.52444 1.50051 4.4577C1.50567 4.39097 1.52418 4.32594 1.55494 4.26649C1.58569 4.20704 1.62808 4.15437 1.67957 4.1116C1.73106 4.06884 1.79062 4.03685 1.85471 4.01753C1.91879 3.99821 1.98611 3.99195 2.05266 3.99913C2.11921 4.00631 2.18364 4.02678 2.24213 4.05933C2.30062 4.09187 2.35199 4.13583 2.39317 4.1886C2.43436 4.24136 2.46453 4.30186 2.4819 4.36651C3.5249 7.85951 8.4729 7.86001 9.5169 4.36851C9.53561 4.30554 9.56654 4.24687 9.60793 4.19586C9.64932 4.14484 9.70035 4.10248 9.7581 4.07119C9.81586 4.03989 9.87922 4.02028 9.94455 4.01347C10.0099 4.00667 10.0759 4.01279 10.1389 4.03151C10.2019 4.05022 10.2605 4.08115 10.3115 4.12254C10.3626 4.16393 10.4049 4.21495 10.4362 4.27271C10.4675 4.33047 10.4871 4.39383 10.4939 4.45916C10.5007 4.5245 10.4946 4.59054 10.4759 4.65351C10.2941 5.27915 9.98554 5.8607 9.5694 6.36201L10.2069 7.00001C10.298 7.09431 10.3484 7.22061 10.3472 7.35171C10.3461 7.48281 10.2935 7.60821 10.2008 7.70092C10.1081 7.79362 9.9827 7.8462 9.8516 7.84734C9.7205 7.84848 9.5942 7.79809 9.4999 7.70701L8.8444 7.05151C8.49069 7.31836 8.0999 7.53212 7.6844 7.68601L7.8629 8.35351C7.88194 8.41753 7.88796 8.48472 7.8806 8.55111C7.87325 8.6175 7.85266 8.68175 7.82006 8.74005C7.78746 8.79835 7.74352 8.84953 7.69081 8.89057C7.6381 8.9316 7.57771 8.96166 7.51319 8.97897C7.44868 8.99628 7.38135 9.00048 7.31518 8.99133C7.24901 8.98219 7.18535 8.95987 7.12795 8.92571C7.07054 8.89155 7.02057 8.84624 6.98097 8.79245C6.94137 8.73865 6.91296 8.67747 6.8974 8.61251L6.7154 7.93401C6.2419 8.00401 5.7579 8.00401 5.2844 7.93401L5.1024 8.61251C5.08684 8.67747 5.05842 8.73865 5.01882 8.79245C4.97923 8.84624 4.92925 8.89155 4.87185 8.92571C4.81445 8.95987 4.75078 8.98219 4.68462 8.99133C4.61845 9.00048 4.55112 8.99628 4.4866 8.97897C4.42209 8.96166 4.36169 8.9316 4.30899 8.89057C4.25628 8.84953 4.21233 8.79835 4.17973 8.74005C4.14714 8.68175 4.12655 8.6175 4.11919 8.55111C4.11184 8.48472 4.11786 8.41753 4.1369 8.35351L4.3154 7.68601C3.89987 7.53196 3.50908 7.31804 3.1554 7.05101L2.5004 7.70701C2.40664 7.80089 2.27943 7.85369 2.14675 7.85378C2.01407 7.85388 1.88678 7.80126 1.7929 7.70751C1.69901 7.61375 1.64621 7.48654 1.64612 7.35386C1.64603 7.22118 1.69864 7.09389 1.7924 7.00001L2.4299 6.36251C2.0379 5.89451 1.7249 5.32551 1.5239 4.65551L1.5249 4.65501Z"
                              fill="black"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {/* icon button */}

                    {form.formState.errors.password && (
                      <p className="text-red-700">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.rememberAndForgot}>
                  <div className={styles.rememberpasswordContainer}>
                    <input
                      type="checkbox"
                      name="remember-password"
                      id="remember-password"
                      value="true"
                    />
                    <label htmlFor="remember-password">Ingat Saya</label>
                  </div>

                  <span>
                    <a href="/" className="hover:text-blue-800">Lupa Password</a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <title>
                        Klik Lupa Pasword ketika anda terdapat masalah ketika
                        Login Akun
                      </title>
                      <g opacity="0.5">
                        <path
                          d="M7.96665 12.5C8.19998 12.5 8.39731 12.4193 8.55865 12.258C8.71998 12.0966 8.80042 11.8995 8.79998 11.6666C8.79954 11.4338 8.71909 11.2364 8.55865 11.0746C8.3982 10.9129 8.20087 10.8324 7.96665 10.8333C7.73242 10.8342 7.53531 10.9149 7.37531 11.0753C7.21531 11.2358 7.13465 11.4329 7.13331 11.6666C7.13198 11.9004 7.21265 12.0978 7.37531 12.2586C7.53798 12.4195 7.73509 12.5 7.96665 12.5ZM7.36665 9.93332H8.59998C8.59998 9.56665 8.64176 9.27776 8.72531 9.06665C8.80887 8.85554 9.04487 8.56665 9.43331 8.19998C9.7222 7.91109 9.94998 7.63598 10.1166 7.37465C10.2833 7.11332 10.3666 6.79954 10.3666 6.43332C10.3666 5.81109 10.1389 5.33332 9.68331 4.99998C9.22776 4.66665 8.68887 4.49998 8.06665 4.49998C7.43331 4.49998 6.91954 4.66665 6.52531 4.99998C6.13109 5.33332 5.85598 5.73332 5.69998 6.19998L6.79998 6.63332C6.85554 6.43332 6.98065 6.21665 7.17531 5.98332C7.36998 5.74998 7.66709 5.63332 8.06665 5.63332C8.4222 5.63332 8.68887 5.73065 8.86665 5.92532C9.04442 6.11998 9.13331 6.33376 9.13331 6.56665C9.13331 6.78887 9.06665 6.99732 8.93331 7.19198C8.79998 7.38665 8.63331 7.56709 8.43331 7.73332C7.94442 8.16665 7.64442 8.49443 7.53331 8.71665C7.4222 8.93887 7.36665 9.34443 7.36665 9.93332ZM7.99998 15.1666C7.07776 15.1666 6.21109 14.9918 5.39998 14.642C4.58887 14.2922 3.88331 13.8171 3.28331 13.2167C2.68331 12.6162 2.20842 11.9106 1.85865 11.1C1.50887 10.2893 1.33376 9.42265 1.33331 8.49998C1.33287 7.57732 1.50798 6.71065 1.85865 5.89998C2.20931 5.08932 2.6842 4.38376 3.28331 3.78332C3.88242 3.18287 4.58798 2.70798 5.39998 2.35865C6.21198 2.00932 7.07865 1.83421 7.99998 1.83332C8.92131 1.83243 9.78798 2.00754 10.6 2.35865C11.412 2.70976 12.1175 3.18465 12.7166 3.78332C13.3158 4.38198 13.7909 5.08754 14.142 5.89998C14.4931 6.71243 14.668 7.57909 14.6666 8.49998C14.6653 9.42087 14.4902 10.2875 14.1413 11.1C13.7924 11.9124 13.3175 12.618 12.7166 13.2167C12.1158 13.8153 11.4102 14.2904 10.6 14.642C9.78976 14.9935 8.92309 15.1684 7.99998 15.1666ZM7.99998 13.8333C9.48887 13.8333 10.75 13.3166 11.7833 12.2833C12.8166 11.25 13.3333 9.98887 13.3333 8.49998C13.3333 7.01109 12.8166 5.74998 11.7833 4.71665C10.75 3.68332 9.48887 3.16665 7.99998 3.16665C6.51109 3.16665 5.24998 3.68332 4.21665 4.71665C3.18331 5.74998 2.66665 7.01109 2.66665 8.49998C2.66665 9.98887 3.18331 11.25 4.21665 12.2833C5.24998 13.3166 6.51109 13.8333 7.99998 13.8333Z"
                          fill="black"
                        />
                      </g>
                    </svg>
                  </span>
                </div>

                {isLoading ? (
                  <button
                    type="button"
                    className="flex items-center justify-center"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-blue-600 mr-2"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    Mengecek...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="hover:bg-blue-600 font-bold transition duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    disabled={isLoading}
                  >
                    Masuk
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className={styles.pictureContainer}>
            <div className={styles.sliderContainer}>
              <div className={styles.illustration}>
                <Image
                  src="/images/illustration1.png"
                  alt="illustrasi 1"
                  width={390}
                  height={390}
                />
              </div>

              <div className={styles.captionContainer}>
                <h5>Aplikasi EkaPrime</h5>
                <p>
                  Sistem Evaluasi Akuntabilitas kinerja yang terintegrasi untuk
                  BPMSPH
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
