import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../store/adminAuthSlice";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// ✅ Validation Schema
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password must be 4+ chars"),
});

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((s) => s.adminAuth);

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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">
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
                placeholder="Enter admin email"
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
              <Input
                type="password"
                placeholder="Enter password"
                {...register("password")}
              />
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
              className="w-full"
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
