import { Button } from '@/components/ui/button';
import { Coffee, Utensils, Beer, ShoppingBag, Gift, Bus, Ticket, Plus } from 'lucide-react';

type ExpenseType = {
  name: string;
  icon: React.ReactNode;
};

const COMMON_EXPENSE_TYPES: ExpenseType[] = [
  { name: 'Cà phê', icon: <Coffee className="h-4 w-4" /> },
  { name: 'Cơm trưa', icon: <Utensils className="h-4 w-4" /> },
  { name: 'Ăn tối', icon: <Utensils className="h-4 w-4" /> },
  { name: 'Nhậu', icon: <Beer className="h-4 w-4" /> },
  { name: 'Mua sắm', icon: <ShoppingBag className="h-4 w-4" /> },
  { name: 'Quà', icon: <Gift className="h-4 w-4" /> },
  { name: 'Di chuyển', icon: <Bus className="h-4 w-4" /> },
  { name: 'Giải trí', icon: <Ticket className="h-4 w-4" /> },
];

interface QuickExpenseTypeProps {
  onSelect: (name: string) => void;
}

export function QuickExpenseType({ onSelect }: QuickExpenseTypeProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full">
        {COMMON_EXPENSE_TYPES.map((type) => (
          <Button
            key={type.name}
            size="sm"
            variant="outline"
            type="button"
            onClick={() => onSelect(type.name)}
            className="flex items-center justify-center gap-1.5 h-9 px-2"
          >
            {type.icon}
            <span className="text-xs sm:text-sm truncate">{type.name}</span>
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={() => onSelect('')}
          className="flex items-center justify-center gap-1.5 h-9 px-2"
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs sm:text-sm">Khác</span>
        </Button>
      </div>
    </div>
  );
} 