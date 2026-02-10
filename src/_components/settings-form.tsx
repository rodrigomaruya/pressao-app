"use client";

import { useState, useEffect } from "react";
import { updateUserSettings } from "@/_actions/update-user-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  email: string;
  dateOfBirth?: Date | null;
  phone?: string | null;
  reminderTime: string;
  reminderEnabled: boolean;
}

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    phone: user.phone || "",
    reminderTime: user.reminderTime || "08:00",
    reminderEnabled: user.reminderEnabled ?? true,
  });

  // Calcula a idade automaticamente quando a data de nascimento muda
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateUserSettings({
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        reminderTime: formData.reminderTime,
        reminderEnabled: formData.reminderEnabled,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Configurações salvas com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-semibold">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-base font-semibold">
            Data de Nascimento
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="h-10"
          />
          {age !== null && (
            <p className="text-sm text-green-600 font-medium">
              Idade: {age} anos
            </p>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-semibold">
            Telefone para WhatsApp
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>

        {/* Horário do Lembrete */}
        {/* <div className="space-y-2">
          <Label htmlFor="reminderTime" className="text-base font-semibold">
            Horário do Lembrete
          </Label>
          <Input
            id="reminderTime"
            name="reminderTime"
            type="time"
            value={formData.reminderTime}
            onChange={handleInputChange}
            className="h-10"
          />
          <p className="text-sm text-gray-500">
            Horário para receber lembretes diários
          </p>
        </div> */}
      </div>

      {/* Ativar/Desativar Lembretes */}
      {/* <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-3">
          <input
            id="reminderEnabled"
            name="reminderEnabled"
            type="checkbox"
            checked={formData.reminderEnabled}
            onChange={handleInputChange}
            className="w-5 h-5 rounded border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <Label
              htmlFor="reminderEnabled"
              className="text-base font-semibold cursor-pointer"
            >
              Ativar Lembretes
            </Label>
            <p className="text-sm text-gray-600">
              {formData.reminderEnabled
                ? "Você receberá mensagens no WhatsApp no horário configurado"
                : "Lembretes desativados"}
            </p>
          </div>
        </div>
      </Card> */}

      {/* Botão de Salvar */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
}
