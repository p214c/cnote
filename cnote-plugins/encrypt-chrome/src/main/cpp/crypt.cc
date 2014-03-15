// http://stackoverflow.com/questions/12306956/example-of-aes-using-crypto

#ifndef CRYPT_IMPORTS

#include "../include/crypt.h"

using namespace std;
using namespace CryptoPP;
using namespace crypto;

string Crypt::encrypt(string encipher) {
	//
	// Encipher text
	//
	string enciphered;

	AES::Encryption aesEncryption(key,
			AES::DEFAULT_KEYLENGTH);
	CBC_Mode_ExternalCipher::Encryption cbcEncryption(aesEncryption,
			iv);

	StreamTransformationFilter stfEncryptor(cbcEncryption,
			new StringSink(enciphered));
	stfEncryptor.Put(reinterpret_cast<const unsigned char*>(encipher.c_str()),
			encipher.length() + 1);
	stfEncryptor.MessageEnd();

	return enciphered;
}

string Crypt::decrypt(string decipher) {
	//
	// Decipher Text
	//
	string deciphered;

	AES::Decryption aesDecryption(key,
			AES::DEFAULT_KEYLENGTH);
	CBC_Mode_ExternalCipher::Decryption cbcDecryption(aesDecryption,
			iv);

	StreamTransformationFilter stfDecryptor(cbcDecryption,
			new StringSink(deciphered));
	stfDecryptor.Put(reinterpret_cast<const unsigned char*>(decipher.c_str()),
			decipher.size());
	stfDecryptor.MessageEnd();

	return deciphered;
}

#endif
