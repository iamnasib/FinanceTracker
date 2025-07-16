import React, {useContext, useEffect} from "react";
import {useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {Link, useNavigate, useParams} from "react-router-dom";
import AccountContext from "@/context/account/AccountContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const CreateUpdateAccount = () => {
  const navigate = useNavigate();
  const accountContext = useContext(AccountContext);
  const {createAccount, getTypes, getAccount, updateAccount} = accountContext;
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "0",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [types, setTypes] = useState([]);

  const params = useParams();
  let accountId = params.id;

  useEffect(() => {
    const fetchAccount = async () => {
      if (accountId) {
        const account = await getAccount(accountId);
        if (account) {
          setFormData({
            name: account.name,
            type: account.type,
            balance: account.balance,
          });
        } else {
          accountId = "";
          navigate("/add-account");
        }
      }
      const types = await getTypes();
      setTypes(types);
    };
    // const fetchTypes = async () => {
    //   const types = await getTypes();
    //   setTypes(types);
    // };

    // fetchTypes();
    fetchAccount();
  }, [getTypes, accountId, getAccount]);
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
    if (parseFloat(formData.balance) < 0) {
      newErrors.balance = "Balance must be a positive number";
    }

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
      if (accountId) {
        await updateAccount(formData, accountId, navigate);
      } else {
        await createAccount(formData, navigate);
      }

      setFormData({
        name: "",
        type: "",
        balance: 0,
      });
      setIsLoading(false);
    }
    // navigate("/");
  };

  return (
    <>
      <div className='container flex items-center justify-center py-6 px-4'>
        <Card className='w-full max-w-xl mx-auto'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center'>
              {accountId ? "Update Account" : "Add Account"}
            </CardTitle>
            {/* <div className='flex items-center justify-between'>
              <ArrowLeft onClick={() => navigate(-1)} />
              <CardTitle className='text-2xl font-bold text-center'>
                {accountId ? "Update Account" : "Add Account"}
              </CardTitle>
              <div></div> 
            </div> */}
            <CardDescription className='text-center'>
              Enter details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  name='name'
                  placeholder='Savings Account'
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Account Type</Label>
                <DropdownMenu
                  id='type'
                  className={`${errors.type ? "border-red-500" : ""}`}>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' className='w-full justify-start'>
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
              <div className='space-y-2'>
                <Label htmlFor='balance'>Balance</Label>
                <Input
                  id='balance'
                  name='balance'
                  placeholder='914'
                  type='number'
                  value={formData.balance}
                  onChange={handleChange}
                  className={errors.balance ? "border-red-500" : ""}
                />
                {errors.balance && (
                  <p className='text-sm text-red-500'>{errors.balance}</p>
                )}
              </div>
              <CardFooter className='flex justify-between gap-2 px-0'>
                <Link to='/accounts'>
                  <Button variant='outline' className='cursor-pointer '>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='text-xs md:text-sm cursor-pointer flex-1'>
                  {isLoading
                    ? accountId
                      ? "Updating..."
                      : "Adding..."
                    : accountId
                    ? "Update Account"
                    : "Add Account"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateUpdateAccount;
