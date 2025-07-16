import React, {useContext, useEffect, useMemo, useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {Link, useNavigate} from "react-router-dom";
import TransactionContext from "@/context/transaction/TransactionContext";
import TransactionItem from "./TransactionItem";
import {Plus} from "lucide-react";

const Transactions = () => {
  const navigate = useNavigate();
  const transactionContext = useContext(TransactionContext);
  const {
    saveTransaction,
    getTransactionTypes,
    getTransactions,
    updateTransaction,
  } = transactionContext;
  const [transactions, setTransactions] = useState([]);
  const handleDelete = async () => {
    const updatedTransactions = await getTransactions();
    if (updatedTransactions) {
      setTransactions(updatedTransactions);
    }
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactons = await getTransactions();
      setTransactions(fetchedTransactons);
    };

    fetchTransactions();
  }, [getTransactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      const date = new Date(transaction.createdOn).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  }, [transactions]);

  // const groupedTransaactions = transactions.reduce((groups, transaction) => {
  //   const date = new Date(transaction.createdOn).toLocaleDateString();
  //   if (!groups[date]) {
  //     groups[date] = [];
  //   }
  //   groups[date].push(transaction);
  //   return groups;
  // }, {});

  return (
    <div className='space-y-2 py-6 px-4'>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            A list of all your transactions across all accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionItem
            transactions={groupedTransactions}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      <Link
        to='/add-transaction'
        aria-label='Add Transaction'
        className={"fixed bottom-18 right-4 z-50"}>
        <div className={"rounded-full bg-slate-950 p-3 text-slate-50"}>
          <Plus size={22} />
        </div>
      </Link>
    </div>
  );
};

export default Transactions;
