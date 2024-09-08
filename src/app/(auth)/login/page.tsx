'use client'
import NavbarLite from "@/components/navbarLite";
import Footer from "@/components/footer";
import Image from "next/image";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInFormSchema } from '@/lib/form-schema';

import type { z } from "zod";

const LoginPage: FC = () => {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });
  

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <NavbarLite />

      <main className="login-main">
        <div className="container">
          <div className="login-container">
            <div className="login-title">
              <h2>Selamat Datang di EkaPrime</h2>
              <h5>
                Sistem Evaluasi Akuntabilitas Kinerja untuk <span>BPMSPH</span>
              </h5>
            </div>

            <div className="login-form">
              <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="input-container">
                  <div className="email-container">
                    <label htmlFor="email">Email</label>
                    <input
                      {...form.register("email")}
                      type="email"
                      name="email"
                      id="email"
                      className="input-bordered input tracking-widest"
                      required
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-700">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="password-container">
                    <label htmlFor="password">Password</label>
                    <input
                      {...form.register("password")}
                      type="password"
                      name="password"
                      id="password"
                      required
                    />
                    {form.formState.errors.password && (
                      <p>{form.formState.errors.password.message}</p>
                    )}
                  </div>
                </div>

                <div className="remember-and-forgot">
                  <div className="rememberpassword-container">
                    <input
                      type="checkbox"
                      name="remember-password"
                      id="remember-password"
                      value="true"
                    />
                    <label htmlFor="remember-password">Ingat Saya</label>
                  </div>

                  <span>
                    <a href="/">Lupa Password</a>
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

                <button type="submit" className="hover:bg-blue-600 font-bold transition duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300">Masuk</button>
              </form>
            </div>
          </div>

          <div className="picture-container">
            <div className="slider-container">
              <div className="illustration">
                <Image
                  src="/images/illustration1.png"
                  alt="illustrasi 1"
                  width={390}
                  height={390}
                />
              </div>

              <div className="caption-container">
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
