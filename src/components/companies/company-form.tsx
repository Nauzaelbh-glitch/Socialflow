'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCompanySchema, type CreateCompanyInput } from '@/lib/modules/companies/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2 } from 'lucide-react';

interface CompanyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CompanyForm({ onSuccess, onCancel }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const onSubmit = async (data: CreateCompanyInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Error al crear empresa');
        return;
      }

      onSuccess?.();
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <CardTitle>Nueva Empresa</CardTitle>
              <CardDescription>
                Agrega un nuevo cliente para gestionar
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nombre de la empresa"
            placeholder="Mi Empresa S.A."
            {...register('name')}
            error={errors.name?.message}
            required
          />

          <Input
            label="Slug (URL)"
            placeholder="mi-empresa"
            helperText="Se usará para la URL única de la empresa"
            {...register('slug')}
            error={errors.slug?.message}
          />
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Empresa'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
