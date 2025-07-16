import React, {useContext, useEffect, useState, useMemo} from "react";
import {Link} from "react-router-dom";
import {Archive, ArchiveX, Coins, CreditCard, Plus, Wallet} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CategoryContext from "@/context/category/CategoryContext";
import CategoryItem from "./CategoryItem";

const Categories = () => {
  const categoryContext = useContext(CategoryContext);
  const {getCategories} = categoryContext;
  const [categories, setCategories] = useState([]);
  const [archive, setArchive] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories(archive);
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      }
    };
    fetchCategories();
  }, [getCategories, archive]);

  const handleArchive = async (categoryId) => {
    const updatedCategories = await getCategories(archive);
    if (updatedCategories) {
      setCategories(updatedCategories);
    }
  };
// const groupedCategories = useMemo(() => {
//   return categories.reduce((map, category) => {
//     const {type} = category;
//     if (!map.has(type)) {
//       map.set(type, []);
//     }
//     map.get(type).push(category);
//     return map;
//   }, new Map());
// }, [categories]);

  // Memoize grouped categories to prevent recalculation on every render
  const groupedCategories = useMemo(() => {
    return categories.reduce((groups, category) => {
      const {type} = category;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(category);
      return groups;
    }, {});
  }, [categories]);

  return (
    <div className='space-y-2 py-6 px-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex leading-none items-center justify-between'>
            Your Categories{" "}
            <span
              className='cursor-pointer'
              onClick={() => setArchive(!archive)}>
              {archive ? <ArchiveX /> : <Archive />}{" "}
            </span>
          </CardTitle>
          <CardDescription>
            A list of all your income and expense categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedCategories).map((type) => (
            <div className='space-y-2' key={type}>
              <h2 className='flex items-center gap-1 text-lg font-medium leading-none'>
                {type}{" "}
                {type === "Income" ? (
                  <Coins size={20} className='text-emerald-600' />
                ) : (
                  <CreditCard size={20} className='text-red-600' />
                )}
              </h2>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-5'>
                {groupedCategories[type].map((category) => (
                  <CategoryItem
                    key={category._id}
                    category={category}
                    onArchive={handleArchive}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Link
        to='/add-category'
        aria-label='Add Category'
        className={"fixed bottom-18 right-4 z-50"}>
        <div className={"rounded-full bg-slate-950 p-3 text-slate-50"}>
          <Plus size={22} />
        </div>
      </Link>
    </div>
  );
};

export default Categories;
