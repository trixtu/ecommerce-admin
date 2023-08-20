"use client";

import * as z from "zod";

import { Button } from "../../../../../../../components/ui/button";
import { Heading } from "../../../../../../../components/ui/heading";
import { Separator } from "../../../../../../../components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../../../components/ui/form";
import { Input } from "../../../../../../../components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "../../../../../../../components/modals/alert-modal";
import { Category, Subcategory } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../../components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
});

type SubcategoryFormValues = z.infer<typeof formSchema>;

interface SubcategoryFormProps {
  intialData: Subcategory | null;
  categories: Category[]
}

export const SubcategoryForm: React.FC<SubcategoryFormProps> = ({ intialData, categories }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = intialData ? "Edit subcategory" : "Create subcategory";
  const description = intialData ? "Edit a subcategory" : "Add a new subcategory";
  const toastMessage = intialData ? "Subcategory updated." : "Subcategory created.";
  const action = intialData ? "Save changes" : "Create";

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
      name: "",
      categoryId: "",
    },
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/subcategories/${params.subcategoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/subcategories`);
      toast.success("Subcategory deleted.");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this subcategory first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onSubmit = async (data: SubcategoryFormValues) => {
    try {
      setLoading(true);
      if (intialData) {
        await axios.patch(
          `/api/${params.storeId}/subcategories/${params.subcategoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/subcategories`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/subcategories`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {intialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subcategory name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {categories.map((category)=>(
                            <SelectItem
                            key={category.id}
                            value={category.id}>
                            {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
