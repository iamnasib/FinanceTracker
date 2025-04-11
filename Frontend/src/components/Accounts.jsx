import AccountContext from "@/context/account/AccountContext";
import React, {useContext, useEffect, useState, useMemo} from "react";
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
    const fetchAccounts = async () => {
      const fetchedAccounts = await getAccounts(archive);
      if (fetchedAccounts) {
        setAccounts(fetchedAccounts);
      }
    };
    fetchAccounts();
  }, [getAccounts, archive]);

  const handleArchive = async (accountId) => {
    const updatedAccounts = await getAccounts(archive);
    if (updatedAccounts) {
      setAccounts(updatedAccounts);
    }
  };

  // Memoize grouped accounts to prevent recalculation on every render
  const groupedAccounts = useMemo(() => {
    return accounts.reduce((groups, account) => {
      const {type} = account;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(account);
      return groups;
    }, {});
  }, [accounts]);

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
              <h2 className='flex items-center gap-1 text-lg font-medium leading-none'>
                {type}{" "}
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
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-5'>
                {groupedAccounts[type].map((account) => (
                  <AccountItem
                    key={account._id}
                    account={account}
                    onArchive={handleArchive}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Link
        to='/add-account'
        aria-label='Add Account'
        className={"fixed bottom-18 right-4 z-50"}>
        <div className={"rounded-full bg-slate-950 p-3 text-slate-50"}>
          <Plus size={22} />
        </div>
      </Link>
    </div>
  );
};

export default Accounts;
