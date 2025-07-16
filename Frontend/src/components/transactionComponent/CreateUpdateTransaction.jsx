import React, {useContext, useEffect, useState} from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {Textarea} from "../ui/textarea";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button} from "../ui/button";
import {Tabs, TabsList, TabsTrigger} from "../ui/tabs";
import TransactionContext from "@/context/transaction/TransactionContext";
import AccountContext from "@/context/account/AccountContext";
import CategoryContext from "@/context/category/CategoryContext";

const CreateUpdateTransaction = () => {
  const navigate = useNavigate();
  const transactionContext = useContext(TransactionContext);
  const {
    saveTransaction,
    getTransactionTypes,
    getTransaction,
    updateTransaction,
  } = transactionContext;
  const accountContext = useContext(AccountContext);
  const {getAccounts} = accountContext;
  const [accounts, setAccounts] = useState([]);

  const categoryContext = useContext(CategoryContext);
  const {getCategories} = categoryContext;
  const [categories, setcategories] = useState([]);
  const [formData, setFormData] = useState({
    type: "Expense",
    fromAccount: "",
    toAccount: "",
    description: "",
    amount: parseFloat(0),
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState([]);

  const params = useParams();
  let transactionId = params.id;
  useEffect(() => {
    const fetchTransaction = async () => {
      if (transactionId) {
        const transaction = await getTransaction(transactionId);
        if (transaction) {
          setFormData({
            type: transaction.type,
            fromAccount: transaction.fromAccount,
            toAccount: transaction.toAccount,
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
          });
        } else {
          navigate("/add-transaction");
        }
      }
      const types = await getTransactionTypes();
      setTransactionTypes(types);
    };
    const fetchAccounts = async () => {
      const accounts = await getAccounts(false); //Non Archived accounts only
      setAccounts(accounts);
    };
    const fetchCategories = async () => {
      // Only fetch categories if type is not Transfer
      if (formData.type !== "Transfer") {
        const category = await getCategories(false, formData.type);
        setcategories(category);
      } else {
        // Clear categories if type is Transfer
        setcategories([]);
      }
    };

    const fetchData = async () => {
      await fetchAccounts();
      await fetchTransaction();
      await fetchCategories();
    };
    fetchData();
  }, [
    getTransactionTypes,
    transactionId,
    getTransaction,
    getAccounts,
    getCategories,
    formData.type,
  ]);

  const validateForm = async () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Transaction type is required";
    }
    if (!formData.amount) {
      newErrors.amount = "Transaction amount is required";
    } else if (parseFloat(formData.amount) < 1) {
      newErrors.amount = "Amount must be a greater than 0";
    }
    if (!formData.category && formData.type !== "Transfer") {
      newErrors.category = "Category is required";
    }
    if (formData.type === "Transfer" && !formData.toAccount) {
      newErrors.toAccount = "To account is required";
    }
    if (!formData.fromAccount) {
      newErrors.fromAccount = "Account is required";
    }
    console.log(newErrors);
    console.log(formData);
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
    setIsLoading(true);
    const updatedFormData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    // Update state and use the new data directly
    setFormData(updatedFormData);
    if (await validateForm()) {
      if (transactionId) {
        await updateTransaction(updatedFormData, transactionId, navigate);
      } else {
        await saveTransaction(updatedFormData, navigate);
      }
      // setFormData({
      //   type: "",
      //   fromAccount: "",
      //   toAccount: "",
      //   description: "",
      //   amount: 0,
      //   category: "",
      // });
    }
    setIsLoading(false);
  };

  return (
    <div className='flex items-center justify-center py-6 px-4'>
      <Card className='w-full max-w-xl mx-auto'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center'>Transaction Details</CardTitle>
          <CardDescription className='text-center'>
            Enter the details of your new transaction.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Transaction Type</Label>
              <Tabs
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    // Reset toAccount if not Transfer
                    toAccount: value === "Transfer" ? prev.toAccount : "",
                    type: value,
                  }));
                }}
                value={formData.type}>
                <TabsList className='grid w-full grid-cols-3'>
                  {transactionTypes.map((type) => (
                    <TabsTrigger key={type} value={type}>
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  onChange={handleChange}
                  id='amount'
                  value={formData.amount}
                  type='number'
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  name='amount'
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className='text-sm text-red-500'>{errors.amount}</p>
                )}
              </div>
              {/* <div className='space-y-2'>
              <Label htmlFor='date'>Date</Label>
              <Input
                id='date'
                type='date'
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div> */}
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='account'>Account</Label>
                <Select
                  name='fromAccount'
                  value={formData.fromAccount}
                  onValueChange={(value) => {
                    setFormData({...formData, fromAccount: value});
                    if (errors.fromAccount) {
                      setErrors({...errors, fromAccount: ""});
                    }
                  }}
                  className={errors.fromAccount ? "border-red-500" : ""}>
                  <SelectTrigger className='w-full' id='account'>
                    <SelectValue placeholder='Select account' />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.fromAccount && (
                  <p className='text-sm text-red-500'>{errors.fromAccount}</p>
                )}
              </div>
              {formData.type === "Transfer" && (
                <div className='space-y-2'>
                  <Label htmlFor='account'>To Account</Label>
                  <Select
                    onValueChange={(value) => {
                      setFormData({...formData, toAccount: value});
                      if (errors.toAccount) {
                        setErrors({...errors, toAccount: ""});
                      }
                    }}
                    name='toAccount'
                    value={formData.toAccount}>
                    <SelectTrigger className='w-full' id='toAccount'>
                      <SelectValue placeholder='Select account' />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account._id} value={account._id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.toAccount && (
                    <p className='text-sm text-red-500'>{errors.toAccount}</p>
                  )}
                </div>
              )}
              {formData.type !== "Transfer" && (
                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <Select
                    onValueChange={(value) => {
                      setFormData({...formData, category: value});
                      if (errors.category) {
                        setErrors({...errors, category: ""});
                      }
                    }}
                    name='category'
                    value={formData.category}>
                    <SelectTrigger className='w-full' id='category'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          onSelect={() => {
                            setFormData({
                              ...formData,
                              category: category._id,
                            });
                            if (errors["fromAccount"]) {
                              setErrors({
                                ...errors,
                                category: "",
                              });
                            }
                          }}
                          key={category._id}
                          value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className='text-sm text-red-500'>{errors.category}</p>
                  )}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                onChange={handleChange}
                name='description'
                id='description'
                placeholder='Enter transaction details...'
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-between gap-2'>
            <Link to='/transactions'>
              <Button variant='outline' className='cursor-pointer '>
                Cancel
              </Button>
            </Link>
            <Button
              type='submit'
              disabled={isLoading}
              className='text-xs md:text-sm cursor-pointer flex-1'>
              {isLoading
                ? transactionId
                  ? "Updating..."
                  : "Saving..."
                : transactionId
                ? "Update"
                : "Save Transaction"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateUpdateTransaction;
