import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../store/adminAuthSlice";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password must be 4+ chars"),
});

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((s) => s.adminAuth);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const res = await dispatch(adminLogin(data));
    if (res?.type?.includes("fulfilled")) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border">
        <CardHeader className="text-center">
          <img
            src="https://glmcollege.ac.in/assets/images/logo.png"
            alt="logo"
            className="w-20 h-20 mx-auto mb-2"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="text-lg font-bold text-blue-900 leading-tight">
            GORELAL MEHTA COLLEGE
          </h1>
          <p className="text-xs text-slate-600 -mt-1">
            BANMANKHI, PURNEA (Bihar)
          </p>
          <CardTitle className="text-xl font-semibold mt-2">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="text"
                placeholder="admin@example.com"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-600"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-600 text-xs text-center">{error}</p>
            )}

            {/* Submit */}
            <Button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              disabled={status === "loading"}
              type="submit"
            >
              {status === "loading" ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
