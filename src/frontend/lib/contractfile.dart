import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';

class ContractConnector extends StatefulWidget {
  @override
  _ContractConnectorState createState() => _ContractConnectorState();
}

class _ContractConnectorState extends State<ContractConnector> {
  Client httpClient;
  Web3Client ethClient;
  Credentials credentials;

  final address =
      "fae159def7563b0ffa1a8f63bc6fe256531bd4a7a1aec00565b134239cd2bb53";

  var myData;
  var vc;
  var vc__;
  var data = false;

  @override
  void initState() {
    super.initState();
    initialSetup();
    getName(address);
  }

  Future<void> initialSetup() async {
    httpClient = Client();
    ethClient = Web3Client("HTTP://127.0.0.1:7545", httpClient);
    await getCredentials();
    vc = await getVideoCount();
    vc__ = vc - BigInt.from(1);
    //await getName(address);
  }

  Future<void> getCredentials() async {
    credentials = await ethClient.credentialsFromPrivateKey(address);
  }

  Future<DeployedContract> loadContract() async {
    String abiStringFile = await rootBundle.loadString("src/abi/YouChain.json");
    final jsonAbi = jsonDecode(abiStringFile);
    final _abiCode = jsonEncode(jsonAbi['abi']);
    final _contractAddress =
        EthereumAddress.fromHex(jsonAbi["networks"]["5777"]["address"]);

    final contract = DeployedContract(
        ContractAbi.fromJson(_abiCode, "YouChain"), _contractAddress);
    return contract;
  }

  Future<List<dynamic>> query(String functionName, List<dynamic> args) async {
    final contract = await loadContract();
    final ethFunction = contract.function(functionName);
    final result = await ethClient.call(
        contract: contract, function: ethFunction, params: args);
    return result;
  }

  Future<void> writefunction(String functionName, List<dynamic> args) async {
    final contract = await loadContract();
    final ethFunction = contract.function(functionName);
    await ethClient.sendTransaction(
      credentials,
      Transaction.callContract(
        contract: contract,
        function: ethFunction,
        parameters: args,
      ),
    );
  }

  Future<void> getName(String address_p) async {
    //EthereumAddress address = EthereumAddress.fromHex(address_p);
    List<dynamic> result = await query("name", []);

    myData = result[0];
    setState(() {
      data = true;
    });
  }

  Future<dynamic> getVideoCount() async {
    List<dynamic> result = await query("videoCount", []);
    vc = result[0];
    return vc;
  }

  uploadVideo() async {
    //var videoc = getVideoCount();
    writefunction("uploadVideo", ["123434356", 'testnest']);
    var videocc = await getVideoCount();
    setState(() {
      vc__ = videocc - BigInt.from(1);
      vc = videocc;
    });
  }

  @override
  Widget build(BuildContext context) {
    return data
        ? Container(
            height: 200,
            width: 500,
            child: Column(
              children: [
                ElevatedButton(
                  onPressed: () {
                    uploadVideo();
                  },
                  child: Text('upload'),
                ),
                Center(child: Text("$myData + $vc + $vc__")),
              ],
            ))
        : CircularProgressIndicator();
  }
}
