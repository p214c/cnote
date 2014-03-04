// http://stackoverflow.com/questions/12306956/example-of-aes-using-crypto

#ifndef CRYPT_IMPORTS

#include "crypt.h"

namespace crypt {

std::string Crypt::encrypt(std::string encipher) {
	//
	// Encipher text
	//
	std::string enciphered;

	CryptoPP::AES::Encryption aesEncryption(key,
			CryptoPP::AES::DEFAULT_KEYLENGTH);
	CryptoPP::CBC_Mode_ExternalCipher::Encryption cbcEncryption(aesEncryption,
			iv);

	CryptoPP::StreamTransformationFilter stfEncryptor(cbcEncryption,
			new CryptoPP::StringSink(enciphered));
	stfEncryptor.Put(reinterpret_cast<const unsigned char*>(encipher.c_str()),
			encipher.length() + 1);
	stfEncryptor.MessageEnd();

	return enciphered;
}

std::string Crypt::decrypt(std::string decipher) {
	//
	// Decipher Text
	//
	std::string deciphered;

	CryptoPP::AES::Decryption aesDecryption(key,
			CryptoPP::AES::DEFAULT_KEYLENGTH);
	CryptoPP::CBC_Mode_ExternalCipher::Decryption cbcDecryption(aesDecryption,
			iv);

	CryptoPP::StreamTransformationFilter stfDecryptor(cbcDecryption,
			new CryptoPP::StringSink(deciphered));
	stfDecryptor.Put(reinterpret_cast<const unsigned char*>(decipher.c_str()),
			decipher.size());
	stfDecryptor.MessageEnd();

	return deciphered;
}

}

#endif
