import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Shield,
  Network,
  Coins,
  User,
  Activity
} from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';

const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
    getBalance, 
    getNetwork 
  } = useWeb3();
  const { user } = useAuth();
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      await loadWalletData();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const loadWalletData = async () => {
    if (isConnected) {
      try {
        const walletBalance = await getBalance();
        setBalance(parseFloat(walletBalance).toFixed(4));
        
        const networkInfo = await getNetwork();
        setNetwork(networkInfo?.name || 'Unknown');
      } catch (error) {
        console.error('Failed to load wallet data:', error);
      }
    }
  };

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openEtherscan = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, '_blank');
    }
  };

  // Load wallet data when connected
  React.useEffect(() => {
    if (isConnected) {
      loadWalletData();
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Wallet className="h-5 w-5 text-purple-600" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to access blockchain features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">MetaMask Required</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect your MetaMask wallet to register your patient identity on the blockchain
              </p>
            </div>
            
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect MetaMask
                </>
              )}
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              By connecting, you agree to our terms of service and privacy policy
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Wallet className="h-5 w-5 text-purple-600" />
          Wallet Connected
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </CardTitle>
        <CardDescription>
          Your MetaMask wallet is connected and ready for blockchain operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Account Info */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm text-black">Account Address</p>
                <p className="text-xs text-gray-600 font-mono">{formatAddress(account!)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openEtherscan}
                className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Wallet Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Balance</span>
              </div>
              <p className="font-semibold text-black">{balance} ETH</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Network className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Network</span>
              </div>
              <p className="font-semibold text-black">{network}</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Linked Account</span>
              </div>
              <p className="text-sm text-green-700">
                Connected as {user.name} ({user.role})
              </p>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadWalletData}
              className="flex-1 bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={disconnectWallet}
              className="flex-1 bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600"
            >
              <Activity className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnection;
