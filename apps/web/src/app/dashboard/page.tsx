'use client';

import { SectionCards } from '@/components/section-cards';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Sample recent orders/transactions data
const recentOrders = [
  {
    id: '3000',
    date: '9 mai 2024',
    customer: 'Jean Kamga',
    property: 'Appartement Bastos',
    propertyImage: '/placeholder.svg',
    amount: '150 000 FCFA',
  },
  {
    id: '3001',
    date: '5 mai 2024',
    customer: 'Marie Njoya',
    property: 'Villa Bonanjo',
    propertyImage: '/placeholder.svg',
    amount: '350 000 FCFA',
  },
  {
    id: '3002',
    date: '28 avr 2024',
    customer: 'Paul Fotso',
    property: 'Studio Akwa',
    propertyImage: '/placeholder.svg',
    amount: '75 000 FCFA',
  },
  {
    id: '3003',
    date: '23 avr 2024',
    customer: 'Sophie Biya',
    property: 'Appartement Bastos',
    propertyImage: '/placeholder.svg',
    amount: '150 000 FCFA',
  },
  {
    id: '3004',
    date: '18 avr 2024',
    customer: 'André Mbarga',
    property: 'Maison Omnisport',
    propertyImage: '/placeholder.svg',
    amount: '200 000 FCFA',
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function DashboardPage() {
  const { user, isLoaded } = useSafeUser();

  if (!isLoaded) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const role = (user?.unsafeMetadata?.role as string) || 'renter';
  const firstName = user?.firstName || 'Utilisateur';

  return (
    <div className="space-y-8">
      {/* Greeting + Time Filter */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {getGreeting()}, {firstName}
        </h1>
        <Select defaultValue="last-week">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">7 derniers jours</SelectItem>
            <SelectItem value="last-month">30 derniers jours</SelectItem>
            <SelectItem value="last-quarter">3 derniers mois</SelectItem>
            <SelectItem value="last-year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <SectionCards role={role as 'renter' | 'landlord'} />

      {/* Recent Orders Table */}
      {role === 'landlord' && (
        <div className="px-4 lg:px-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Transactions récentes</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">N° commande</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Client</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Propriété</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Montant
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-border last:border-0">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 overflow-hidden rounded">
                          <Image
                            src={order.propertyImage}
                            alt={order.property}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{order.property}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Renter: Recent Activity */}
      {role === 'renter' && (
        <div className="px-4 lg:px-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Activité récente</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Propriété</TableHead>
                  <TableHead className="text-muted-foreground font-medium">
                    Date de visite
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">Propriétaire</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Statut</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Prix
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.slice(0, 3).map((order) => (
                  <TableRow key={order.id} className="border-b border-border last:border-0">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 overflow-hidden rounded">
                          <Image
                            src={order.propertyImage}
                            alt={order.property}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{order.property}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary">
                        Consulté
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
