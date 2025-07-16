import CategoryContext from "@/context/category/CategoryContext";
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Button} from "../ui/button";

const CreateUpdateCategory = () => {
  const navigate = useNavigate();
  const categoryContext = useContext(CategoryContext);
  const {createCategory, getTypes, getCategory, updateCategory} =
    categoryContext;
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [types, setTypes] = useState([]);

  const params = useParams();
  let categoryId = params.id;

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        const category = await getCategory(categoryId);
        if (category) {
          setFormData({
            name: category.name,
            type: category.type,
          });
        } else {
          accountId = "";
          navigate("/add-category");
        }
      }
      const types = await getTypes();
      setTypes(types);
    };

    fetchCategory();
  }, [getTypes, categoryId, getCategory]);
  const validateForm = () => {
    const newErrors = {};

    //name Validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    //type Validation
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    //balance  Validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      if (categoryId) {
        await updateCategory(formData, categoryId, navigate);
      } else {
        await createCategory(formData, navigate);
      }

      setFormData({
        name: "",
        type: "",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='container flex items-center justify-center py-6 px-4'>
        <Card className='w-full max-w-xl mx-auto'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center'>
              {categoryId ? "Update Category" : "Add Category"}
            </CardTitle>
            <CardDescription className='text-center'>
              Create your own Custom Category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  name='name'
                  placeholder='Shopping'
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Category Type</Label>
                <DropdownMenu
                  id='type'
                  className={`${errors.type ? "border-red-500" : ""}`}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      disabled={categoryId}
                      className='w-full justify-start'>
                      {formData.type ? formData.type : "Select"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-full justify-start'
                    align='start'>
                    {types.map((type) => (
                      <DropdownMenuItem
                        name='type'
                        className={`${
                          formData.type == type ? "bg-gray-300" : ""
                        }`}
                        key={type}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            type,
                          });
                          if (errors["type"]) {
                            setErrors({
                              ...errors,
                              ["type"]: "",
                            });
                          }
                        }}>
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {errors.type && (
                  <p className='text-sm text-red-500'>{errors.type}</p>
                )}
              </div>
              <CardFooter className='flex justify-between gap-2 px-0'>
                <Link to='/categories'>
                  <Button variant='outline' className='cursor-pointer '>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='flex-1 cursor-pointer '>
                  {isLoading
                    ? categoryId
                      ? "Updating..."
                      : "Adding..."
                    : categoryId
                    ? "Update Category"
                    : "Add Category"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateUpdateCategory;
