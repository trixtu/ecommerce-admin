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
import { Billboard, Category } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../../components/ui/select";
import { Textarea } from "../../../../../../../components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
  desc:z.string()
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  intialData: Category | null;
  billboards: Billboard[],
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ intialData, billboards }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = intialData ? "Edit category" : "Create category";
  const description = intialData ? "Edit a category" : "Add a new category";
  const toastMessage = intialData ? "Category updated." : "Category created.";
  const action = intialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
      name: "",
      desc:"",
      billboardId: "",
    },
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this category first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (intialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Category Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
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
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {billboards.map((billboard)=>(
                            <SelectItem
                            key={billboard.id}
                            value={billboard.id}>
                            {billboard.label}
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
