import 'package:aias/SplashPage/viewmodel.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SplashPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => SplashViewModel()),
      ],
      child: Scaffold(
        appBar: AppBar(title: Text("")),
        body: _SplashBody(),
      ),
    );
  }
}

class _SplashBody extends StatefulWidget {
  @override
  __SplashPageBodyState createState() => __SplashPageBodyState();
}

class __SplashPageBodyState extends State<_SplashBody> {
  @override
  void initState() {
    super.initState();
    var viewModel = Provider.of<SplashViewModel>(context, listen: false);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'This is test',
      ),
    );
  }
}