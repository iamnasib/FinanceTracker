import React, {useContext, useState, useEffect, use} from "react";
import {Badge} from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import {Button} from "../ui/button";
import TransactionContext from "@/context/transaction/TransactionContext";
import {Link} from "react-router-dom";
import CategoryContext from "@/context/category/CategoryContext";
import AccountContext from "@/context/account/AccountContext";

const TransactionItem = (props) => {
  const {transactions, onDelete} = props;
  const {deleteTransaction} = useContext(TransactionContext);
  const [categories, setCategories] = useState({});
  const categoryContext = useContext(CategoryContext);
  const {getCategories} = categoryContext;
  const accountContext = useContext(AccountContext);
  const {getAccounts} = accountContext;
  const [accounts, setAccounts] = useState({});
  useEffect(() => {
    const fetchCategoriesAndAccounts = async () => {
      try {
        const fetchedCategories = await getCategories();
        const fetchedAccounts = await getAccounts();

        const categoryMap = fetchedCategories.reduce((acc, curCat) => {
          acc[String(curCat._id)] = curCat.name;
          return acc;
        }, {});
        const accountMap = fetchedAccounts.reduce((acc, curAcc) => {
          acc[String(curAcc._id)] = curAcc.name;
          return acc;
        }, {});

        setAccounts(accountMap);
        setCategories(categoryMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategoriesAndAccounts();
  }, []);
  const handleDelete = async (transactionId) => {
    await deleteTransaction(transactionId);
    onDelete(transactionId);
  };
  return (
    <div className='rounded-md border'>
      {/* <div className='grid grid-cols-6 gap-4 p-4 text-sm font-medium'>
        <div>Category</div>
        <div>Account</div>
        <div>Date</div>
        <div className='text-right'>Amount</div>
        <div></div>
      </div> */}

      {Object.entries(transactions).map(
        ([date, groupedTransactions, index]) => (
          <div key={index}>
            <div className='bg-gray-50 px-4 py-2 text-sm font-semibold'>
              {date}
            </div>
            {groupedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='grid grid-cols-6 gap-4 p-4 text-sm items-center'>
                <div>
                  {transaction.category ? (
                    <Badge
                      variant='outline'
                      className={
                        transaction.type === "Income"
                          ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                      }>
                      {categories[String(transaction.category)] ||
                        transaction.category}
                    </Badge>
                  ) : (
                    <Badge>Transfer</Badge>
                  )}
                </div>
                <div>
                  {accounts[String(transaction.fromAccount)] || "Loading..."}{" "}
                  {transaction.toAccount &&
                    accounts[String(transaction.toAccount)] &&
                    `→ ${accounts[String(transaction.toAccount)]}`}
                </div>
                {/* <div>
                  {new Date(transaction.createdOn).toLocaleDateString()}
                </div> */}
                <div
                  className={`text-right font-medium
                ${
                  transaction.type === "Income"
                    ? "text-green-600"
                    : transaction.type === "Transfer"
                    ? "text-gray-600"
                    : "text-red-600"
                }
            `}>
                  {transaction.type === "Income"
                    ? "+"
                    : transaction.type === "Expense"
                    ? "-"
                    : ""}
                  {Math.abs(transaction.amount).toFixed(2)}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 p-0 cursor-pointer'>
                      <span className='sr-only'>Open menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Link to={`/update-transaction/${transaction._id}`}>
                        <DropdownMenuItem className='cursor-pointer'>
                          Edit transaction
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(transaction._id)}
                      className='text-red-600 cursor-pointer'>
                      Delete transaction
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default TransactionItem;
