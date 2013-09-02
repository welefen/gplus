if [ -d "target" ];then
    rm -rf "target";
fi
mkdir target;
cp -r src/* target;
rm -rf target/sftp-config.json;
mkdir target/static;
mkdir target/php;
mv target/css target/static/;
mv target/js target/static/;
mv target/*.php target/php;
mv target/style.css target/static/css;


#!/bin/sh
STC_PATH="/Users/welefen/Develop/svn/STC/src"
path=`dirname $0`;

if [ -d ${path}"/output" ];then
    rm -rf ${path}"/output";
fi
mkdir ${path}"/output";
if [ ! -f ${path}"/config.php" ];then
    cp $STC_PATH/config/config.php ${path};
fi
#path=$(pwd);
php $STC_PATH/index.php ${path} test $1;
if [ -f ${path}"/stc.error.log" ]; then
    rm -rf ${path}"/stc.error.log";
fi


mv output/target/php/*.php output/;
mv output/target/static/* output;
rm -rf output/target;
rm -rf target/static;
rm -rf target/php;
mv target/* output;
mv output/css/style.css output/;

scp -r output/* root@103.6.85.113:/home/welefen/www/www.welefen.com/wp-content/themes/gplus/; 
