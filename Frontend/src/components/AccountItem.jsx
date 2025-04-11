import {MoreHorizontal} from "lucide-react";
import React, {useContext} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {Card, CardContent} from "./ui/card";
import {Button} from "./ui/button";
import {Link, useNavigate} from "react-router-dom";
import AccountContext from "@/context/account/AccountContext";

const AccountItem = (props) => {
  const {account, onArchive} = props;
  const accountContext = useContext(AccountContext);
  const {archiveAccount} = accountContext;
  const handleArchive = async () => {
    await archiveAccount(account._id); // Archive the category
    onArchive(account._id); // Trigger the callback to update the state
  };
  return (
    <Card key={account.id}>
      <CardContent className='px-4.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div>
              <h3 className='font-medium leading-none'>{account.name}</h3>
              {/* <p className='text-sm text-muted-foreground'>{account.type}</p> */}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0 cursor-pointer'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <Link to={`/update-account/${account._id}`}>
                <DropdownMenuItem className='cursor-pointer'>
                  Edit account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-muted-foreground'>
                View transactions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleArchive}
                className='text-red-600 cursor-pointer'>
                {account.archive ? "Unarchive account" : "Archive account"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <p
            className={`text-2xl font-bold ${
              account.type === "Credit Card"
                ? account.balance <= 0
                  ? "text-green-800"
                  : "text-red-800"
                : account.balance <= 0
                ? "text-red-800"
                : "text-green-800"
            }`}>
            {account.balance < 0 ? "-" : ""}
            {Math.abs(account.balance).toFixed(2)}
          </p>
          <p className='text-xs text-muted-foreground'>Current Balance</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountItem;
