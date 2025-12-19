import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface BookerFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function BookerForm({ onSubmit, onCancel }: BookerFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <Input name="name" required placeholder="John Doe" />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <Input name="email" type="email" required placeholder="john@company.com" />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Employee ID</label>
                <Input name="employeeId" required placeholder="EMP123" />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <Input name="phoneNumber" required placeholder="0912345678" />
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Back
                </Button>
                <Button type="submit" className="flex-1">
                    Complete Booking
                </Button>
            </div>
        </form>
    );
}
