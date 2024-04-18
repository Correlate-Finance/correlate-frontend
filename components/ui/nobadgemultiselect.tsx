import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  label: String;
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

function NoBadgeMultiSelect({
  options,
  selected,
  onChange,
  className,
  label,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(options.map((o) => o.value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${selected.length > 1 ? 'h-full' : 'h-10'}`}
          onClick={() => setOpen(!open)}
        >
          {selected.length === 0
            ? 'Select ' + { label }
            : selected.length === 1
              ? options.find((o) => o.value === selected[0])?.label
              : `${label} (${selected.length})`}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value],
                  );
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <div className="flex gap-1">
              <Button variant="ghost" onClick={clearAll}>
                Clear All
              </Button>
              <Button variant="ghost" onClick={selectAll}>
                Select All
              </Button>
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { NoBadgeMultiSelect };
