'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Mock payment data
const mockPayments = [
  {
    id: '1',
    type: 'rent_payment',
    amount: 150000,
    currency: 'XAF',
    status: 'completed',
    property: 'Appartement 2 chambres - Makepe',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    method: 'MTN MoMo',
    reference: 'TXN-2024-001234',
  },
  {
    id: '2',
    type: 'deposit',
    amount: 300000,
    currency: 'XAF',
    status: 'completed',
    property: 'Appartement 2 chambres - Makepe',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    method: 'Orange Money',
    reference: 'TXN-2024-001100',
  },
  {
    id: '3',
    type: 'rent_payment',
    amount: 150000,
    currency: 'XAF',
    status: 'pending',
    property: 'Appartement 2 chambres - Makepe',
    date: new Date(),
    method: null,
    reference: null,
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  completed: { label: 'Complété', color: 'bg-green-100 text-green-800' },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  failed: { label: 'Échoué', color: 'bg-red-100 text-red-800' },
  processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
};

const typeLabels: Record<string, string> = {
  rent_payment: 'Paiement de loyer',
  deposit: 'Caution',
  commission: 'Commission',
  refund: 'Remboursement',
};

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PaymentsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredPayments = mockPayments.filter(
    (payment) => filter === 'all' || payment.status === filter
  );

  const totalPaid = mockPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-600 mt-1">Historique et gestion de vos paiements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total payé</CardDescription>
            <CardTitle className="text-2xl text-green-600">{formatCurrency(totalPaid)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {formatCurrency(pendingAmount)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prochaine échéance</CardDescription>
            <CardTitle className="text-2xl">
              {pendingAmount > 0 ? formatCurrency(pendingAmount) : '-'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les paiements</SelectItem>
            <SelectItem value="completed">Complétés</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="failed">Échoués</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">Exporter</Button>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-4">Transaction</div>
            <div className="col-span-3">Propriété</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Montant</div>
            <div className="col-span-1">Statut</div>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun paiement</h3>
            <p className="text-gray-500">Vos transactions apparaîtront ici</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="px-4 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <p className="font-medium text-gray-900">{typeLabels[payment.type]}</p>
                    <p className="text-sm text-gray-500">
                      {payment.reference || 'En attente de paiement'}
                    </p>
                    {payment.method && (
                      <p className="text-xs text-gray-400 mt-1">via {payment.method}</p>
                    )}
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 truncate">{payment.property}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                  </div>
                  <div className="col-span-1">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        statusLabels[payment.status]?.color
                      )}
                    >
                      {statusLabels[payment.status]?.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Méthodes de paiement</CardTitle>
          <CardDescription>Nous acceptons les paiements via Mobile Money</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <span className="text-2xl">📱</span>
              <span className="font-medium">MTN MoMo</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <span className="text-2xl">📱</span>
              <span className="font-medium">Orange Money</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
