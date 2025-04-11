import React, {useContext} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import {Link} from "react-router-dom";
import {MoreHorizontal} from "lucide-react";
import {Card, CardContent} from "../ui/card";
import CategoryContext from "@/context/category/CategoryContext";

const CategoryItem = (props) => {
  const {category, onArchive} = props;
  const {archiveCategory} = useContext(CategoryContext);
  const handleArchive = async () => {
    await archiveCategory(category._id); // Archive the category
    onArchive(category._id); // Trigger the callback to update the state
  };
  return (
    <Card className='py-4' key={category.id}>
      <CardContent className='px-4.5'>
        <div className='flex items-center justify-between'>
          <h3 className='font-medium leading-none'>{category.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0 cursor-pointer'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <Link to={`/update-category/${category._id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                  Edit category
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-muted-foreground'>
                View transactions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleArchive}
                className='text-red-600 cursor-pointer'>
                {category.archive ? "Unarchive category" : "Archive category"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryItem;
