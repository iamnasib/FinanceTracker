import AccountContext from "@/context/account/AccountContext";
import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {
  Archive,
  ArchiveX,
  Coins,
  CreditCard,
  Landmark,
  Plus,
  Wallet,
} from "lucide-react";
import AccountItem from "./AccountItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const Accounts = () => {
  const accountContext = useContext(AccountContext);
  const {getAccounts} = accountContext;
  const [accounts, setAccounts] = useState([]);
  const [archive, setArchive] = useState(false);
  useEffect(() => {
    const getAcc = async () => {
      setAccounts(await getAccounts(archive)); // Fetch non-archived accounts
    };
    getAcc();
  }, [getAccounts, archive]);

  // Group accounts by type
  const groupedAccounts = accounts.reduce((groups, account) => {
    const {type} = account;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {});

  return (
    <div className='space-y-2 py-6 px-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex leading-none items-center justify-between'>
            Your Accounts{" "}
            <span
              className='cursor-pointer'
              onClick={() => setArchive(!archive)}>
              {archive ? <ArchiveX /> : <Archive />}{" "}
            </span>
          </CardTitle>
          <CardDescription>
            A list of all your financial accounts and their current balances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedAccounts).map((type) => (
            <div className='space-y-2' key={type}>
              <h2 className='flex item-center gap-1 text-lg font-medium mt-2 leading-none'>
                {type}{" "}
                {/* <account.icon className={`h-5 w-5 ${account.iconColor}`} /> */}
                {type === "Bank" ? (
                  <Landmark size={20} className='text-emerald-600' />
                ) : type === "Credit Card" ? (
                  <CreditCard size={20} className='text-red-600' />
                ) : type === "Cash" ? (
                  <Coins size={20} className='text-blue-600' />
                ) : (
                  <Wallet size={20} className='text-purple-600' />
                )}
              </h2>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {groupedAccounts[type].map((account) => (
                  <AccountItem key={account._id} account={account} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Link to='/add-account' className={"fixed bottom-18 right-4 z-50"}>
        <div className={"rounded-full bg-slate-950 p-3 text-slate-50"}>
          <Plus size={22} />
        </div>
      </Link>
    </div>
  );
};

export default Accounts;
