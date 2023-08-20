import React from "react";
import prismadb from "../../../../../lib/prismadb";
import { SubcategoryClient } from "./components/client";
import { SubcategoryColumn } from "./components/columns";
import { format } from "date-fns";

const SubcategoryPage = async ({ params }: { params: { storeId: string } }) => {

    const subcategories = await prismadb.subcategory.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            category:true
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedSubcategories: SubcategoryColumn[] = subcategories.map((item) => ({
      id: item.id,
      name: item.name,
      subcategoryName:item.category.name,
      createdAt:format(item.createdAt,"MMMM do,yyyy")
    }));

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubcategoryClient data={formattedSubcategories} />
      </div>
    </div>
    );
};

export default SubcategoryPage;
